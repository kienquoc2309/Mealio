import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
    );
  }

  async createCheckoutSession(
    orderId: string,
    items: CheckoutItem[],
  ): Promise<{ url: string; sessionId: string }> {
    const frontendUrl = this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      metadata: { orderId },
      payment_intent_data: {
        metadata: { orderId },
      },
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/cancel?order_id=${orderId}`,
    });

    return { url: session.url!, sessionId: session.id };
  }

  async verifySession(sessionId: string): Promise<{
    paid: boolean;
    orderId: string;
    transactionId: string;
  }> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);

    return {
      paid: session.payment_status === 'paid',
      orderId: session.metadata?.orderId ?? '',
      transactionId: session.payment_intent as string,
    };
  }

  constructWebhookEvent(
    payload: Buffer,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
