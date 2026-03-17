import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Headers,
  HttpCode,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { PaymentsService } from '../payments/payments.service';
import type { MomoIpnPayload } from '../payments/payments.service';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import type Stripe from 'stripe';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('placeOrder')
  async placeOrder(
    @Req() req: AuthenticatedRequest,
    @Body() body: PlaceOrderDto,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.ordersService.placeOrder(
      req.userId,
      body.address,
      body.paymentMethod,
      ipAddr,
    );
  }

  @UseGuards(AuthGuard)
  @Post('verifyOrder')
  async verifyOrder(
    @Req() req: AuthenticatedRequest,
    @Query('session_id') sessionId: string,
  ) {
    return this.ordersService.verifyOrder(sessionId, req.userId);
  }

  @UseGuards(AuthGuard)
  @Get('userOrders')
  async getUserOrders(@Req() req: AuthenticatedRequest) {
    return this.ordersService.getUserOrders(req.userId);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('listOrders')
  async listAllOrders() {
    return this.ordersService.listAllOrders();
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updateStatus')
  async updateStatus(@Body() body: UpdateStatusDto) {
    return this.ordersService.updateStatus(body.orderId, body.orderStatus);
  }

  // Stripe webhook — no auth guard, verified by signature
  @Post('webhook/stripe')
  @HttpCode(200)
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    let event: Stripe.Event;
    try {
      event = this.paymentsService.constructWebhookEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        // Session completed — payment confirmation is handled by payment_intent.succeeded
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          await this.ordersService.updatePaymentStatus(orderId, 'failed', '');
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await this.ordersService.updatePaymentStatus(
            orderId,
            'paid',
            paymentIntent.id,
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await this.ordersService.updatePaymentStatus(
            orderId,
            'failed',
            paymentIntent.id,
          );
        }
        break;
      }
    }

    return { received: true };
  }

  // VNPay IPN callback — no auth guard, verified by HMAC signature
  @Get('webhook/vnpay')
  @HttpCode(200)
  async vnpayIpn(@Query() query: Record<string, string>) {
    const result = this.paymentsService.verifyVnpayIpn(query);

    if (!result.isValid) {
      return { RspCode: '97', Message: 'Invalid signature' };
    }

    if (!result.orderId) {
      return { RspCode: '01', Message: 'Order not found' };
    }

    const paymentStatus = result.responseCode === '00' ? 'paid' : 'failed';

    await this.ordersService.updatePaymentStatus(
      result.orderId,
      paymentStatus,
      result.transactionId,
    );

    return { RspCode: '00', Message: 'Confirm Success' };
  }

  // MoMo IPN callback — no auth guard, verified by HMAC signature
  @Post('webhook/momo')
  @HttpCode(204)
  async momoIpn(@Body() body: MomoIpnPayload) {
    const result = this.paymentsService.verifyMomoIpn(body);

    if (!result.isValid || !result.orderId) {
      return;
    }

    const paymentStatus = result.resultCode === 0 ? 'paid' : 'failed';

    await this.ordersService.updatePaymentStatus(
      result.orderId,
      paymentStatus,
      result.transactionId,
    );
  }
}
