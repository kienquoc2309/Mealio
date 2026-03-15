import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Food } from '../foods/schemas/food.schema';
import { PaymentsService } from '../payments/payments.service';

interface PopulatedCartItem {
  foodId: Food & { _id: Types.ObjectId };
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private paymentsService: PaymentsService,
  ) {}

  async placeOrder(
    userId: string,
    address: {
      street: string;
      city: string;
      phone: string;
      receiverName: string;
    },
    paymentMethod: string,
  ) {
    const user = await this.userModel
      .findById(userId)
      .populate('cart.foodId')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.cart || user.cart.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Snapshot food data from cart
    const cartItems = user.cart as unknown as PopulatedCartItem[];
    const items = cartItems
      .filter((item) => item.foodId !== null)
      .map((item) => ({
        foodId: item.foodId._id,
        name: item.foodId.name,
        price: item.foodId.price,
        image: item.foodId.image,
        quantity: item.quantity,
      }));

    if (items.length === 0) {
      throw new BadRequestException('No valid items in cart');
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const feeShip = subtotal > 500000 ? 0 : 30000;
    const totalAmount = subtotal + feeShip;

    // Create order
    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items,
      feeShip,
      totalAmount,
      address,
      paymentMethod,
      orderStatus: 'pending',
      paymentStatus: 'pending',
    });

    // Clear cart after successful order creation
    await this.userModel.findByIdAndUpdate(userId, { cart: [] });

    // Generate payment URL based on payment method
    let paymentUrl = '';
    if (paymentMethod === 'stripe') {
      const session = await this.paymentsService.createCheckoutSession(
        order._id.toString(),
        items,
      );
      paymentUrl = session.url;
      await this.orderModel.findByIdAndUpdate(order._id, {
        sessionId: session.sessionId,
      });
    }

    return {
      success: true,
      order,
      paymentUrl,
      message: 'Order placed successfully',
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, orders };
  }

  async listAllOrders() {
    const orders = await this.orderModel.find().sort({ createdAt: -1 }).lean();

    return { success: true, orders };
  }

  async verifyOrder(sessionId: string, userId: string) {
    const result = await this.paymentsService.verifySession(sessionId);

    if (!result.orderId) {
      throw new BadRequestException('Invalid session');
    }

    // Only read order status — payment updates are handled exclusively by webhooks
    const order = await this.orderModel.findById(result.orderId).lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId.toString() !== userId) {
      throw new BadRequestException('Order does not belong to this user');
    }

    return { success: true, order };
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: string,
    transactionId: string,
  ) {
    // Skip if order is already in a final payment state (idempotent for duplicate webhook events)
    const existing = await this.orderModel.findById(orderId).lean();
    if (!existing) {
      throw new NotFoundException('Order not found');
    }
    if (existing.paymentStatus === 'paid') {
      return { success: true, order: existing };
    }

    const update: Record<string, string> = { paymentStatus, transactionId };
    if (paymentStatus === 'paid') {
      update.orderStatus = 'confirmed';
    }

    const order = await this.orderModel
      .findByIdAndUpdate(orderId, update, { returnDocument: 'after' })
      .lean();

    return { success: true, order };
  }

  async updateStatus(orderId: string, orderStatus: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel
      .findByIdAndUpdate(orderId, { orderStatus }, { returnDocument: 'after' })
      .lean();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return { success: true, order, message: 'Order status updated' };
  }
}
