import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import * as crypto from 'crypto';

export interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface MomoIpnPayload {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
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

  // ── VNPay ──────────────────────────────────────────────────────────

  createVnpayPaymentUrl(
    orderId: string,
    totalAmount: number,
    ipAddr: string,
  ): string {
    const tmnCode = this.configService.get<string>('VNP_TMN_CODE')!;
    const hashSecret = this.configService.get<string>('VNP_HASH_SECRET')!;
    const vnpUrl = this.configService.get<string>(
      'VNP_URL',
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    );
    const frontendUrl = this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );

    const createDate = this.formatVnpDate(new Date());
    const expireDate = this.formatVnpDate(
      new Date(Date.now() + 15 * 60 * 1000),
    );

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: String(Math.round(totalAmount * 100)),
      vnp_ReturnUrl: `${frontendUrl}/payment/vnpay-return`,
      vnp_IpAddr: this.sanitizeIpv4(ipAddr),
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    const sortedParams = this.sortVnpParams(params);

    // Sign using raw values (no URL encoding) — VNPay requires this
    const signData = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Build URL with proper encoding
    const queryString = Object.entries(sortedParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');

    const paymentUrl = `${vnpUrl}?${queryString}&vnp_SecureHash=${signed}`;

    this.logger.debug('[VNPay] createVnpayPaymentUrl');
    this.logger.debug(`[VNPay] vnpUrl: ${vnpUrl}`);
    this.logger.debug(`[VNPay] params: ${JSON.stringify(sortedParams)}`);
    this.logger.debug(`[VNPay] signData: ${signData}`);
    this.logger.debug(`[VNPay] signature: ${signed}`);
    this.logger.debug(`[VNPay] paymentUrl: ${paymentUrl}`);

    return paymentUrl;
  }

  verifyVnpayIpn(query: Record<string, string>): {
    isValid: boolean;
    orderId: string;
    transactionId: string;
    responseCode: string;
  } {
    const hashSecret = this.configService.get<string>('VNP_HASH_SECRET')!;
    const secureHash = query['vnp_SecureHash'];

    // Remove hash fields before re-signing
    const params = { ...query };
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedParams = this.sortVnpParams(params);
    const signData = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValid = secureHash === signed;

    this.logger.debug('[VNPay] verifyVnpayIpn');
    this.logger.debug(`[VNPay] received query: ${JSON.stringify(query)}`);
    this.logger.debug(`[VNPay] signData: ${signData}`);
    this.logger.debug(`[VNPay] expectedSignature: ${signed}`);
    this.logger.debug(`[VNPay] receivedSignature: ${secureHash}`);
    this.logger.debug(`[VNPay] isValid: ${isValid}`);

    return {
      isValid,
      orderId: query['vnp_TxnRef'] ?? '',
      transactionId: query['vnp_TransactionNo'] ?? '',
      responseCode: query['vnp_ResponseCode'] ?? '',
    };
  }

  // ── MoMo ──────────────────────────────────────────────────────────

  async createMomoPaymentUrl(
    orderId: string,
    totalAmount: number,
  ): Promise<string> {
    const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE')!;
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY')!;
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY')!;
    const momoApiUrl = this.configService.get<string>(
      'MOMO_API_URL',
      'https://test-payment.momo.vn/v2/gateway/api/create',
    );
    const backendUrl = this.configService.get<string>(
      'app.backendUrl',
      'http://localhost:5000',
    );
    const frontendUrl = this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );

    const requestId = `${orderId}_${Date.now()}`;
    const orderInfo = `Thanh toan don hang ${orderId}`;
    const redirectUrl = `${frontendUrl}/payment/momo-return`;
    const ipnUrl = `${backendUrl}/orders/webhook/momo`;
    const requestType = 'payWithMethod';
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${totalAmount}`,
      `extraData=${extraData}`,
      `ipnUrl=${ipnUrl}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `partnerCode=${partnerCode}`,
      `redirectUrl=${redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const response = await fetch(momoApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerCode,
        partnerName: 'Mealio',
        storeId: partnerCode,
        requestId,
        amount: totalAmount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        signature,
      }),
    });

    const data = (await response.json()) as {
      resultCode: number;
      message: string;
      payUrl: string;
    };

    if (data.resultCode !== 0) {
      throw new Error(`MoMo error: ${data.message}`);
    }

    return data.payUrl;
  }

  verifyMomoIpn(body: MomoIpnPayload): {
    isValid: boolean;
    orderId: string;
    transactionId: string;
    resultCode: number;
  } {
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY')!;
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY')!;

    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${body.amount}`,
      `extraData=${body.extraData}`,
      `message=${body.message}`,
      `orderId=${body.orderId}`,
      `orderInfo=${body.orderInfo}`,
      `orderType=${body.orderType}`,
      `partnerCode=${body.partnerCode}`,
      `payType=${body.payType}`,
      `requestId=${body.requestId}`,
      `responseTime=${body.responseTime}`,
      `resultCode=${body.resultCode}`,
      `transId=${body.transId}`,
    ].join('&');

    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    return {
      isValid: body.signature === expectedSignature,
      orderId: body.orderId ?? '',
      transactionId: String(body.transId ?? ''),
      resultCode: body.resultCode ?? -1,
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  private sortVnpParams(
    params: Record<string, string>,
  ): Record<string, string> {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(params).sort();
    for (const key of keys) {
      if (params[key] !== '' && params[key] !== undefined) {
        sorted[key] = params[key];
      }
    }
    return sorted;
  }

  private sanitizeIpv4(ip: string): string {
    if (!ip) return '127.0.0.1';
    // Strip IPv4-mapped IPv6 prefix: ::ffff:1.2.3.4 → 1.2.3.4
    const stripped = ip.replace(/^::ffff:/i, '');
    // If still IPv4 (dotted quad), return it
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(stripped)) return stripped;
    // Loopback or any IPv6 → fall back to IPv4 loopback (VNPay requires IPv4)
    return '127.0.0.1';
  }

  private formatVnpDate(date: Date): string {
    // VNPay requires Vietnam timezone (UTC+7)
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const y = vnDate.getUTCFullYear();
    const m = String(vnDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(vnDate.getUTCDate()).padStart(2, '0');
    const h = String(vnDate.getUTCHours()).padStart(2, '0');
    const min = String(vnDate.getUTCMinutes()).padStart(2, '0');
    const s = String(vnDate.getUTCSeconds()).padStart(2, '0');
    return `${y}${m}${d}${h}${min}${s}`;
  }
}
