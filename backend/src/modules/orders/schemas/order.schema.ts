import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Food', required: true })
  foodId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  quantity!: number;
}

export class OrderAddress {
  @Prop({ required: true })
  street!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  receiverName!: string;
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({
    type: [
      {
        foodId: { type: Types.ObjectId, ref: 'Food' },
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
    required: true,
  })
  items!: OrderItem[];

  @Prop({ required: true })
  feeShip!: number;

  @Prop({ required: true })
  totalAmount!: number;

  @Prop({
    type: {
      street: String,
      city: String,
      phone: String,
      receiverName: String,
    },
    required: true,
  })
  address!: OrderAddress;

  @Prop({
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'delivering',
      'delivered',
      'cancelled',
    ],
    default: 'pending',
  })
  orderStatus!: string;

  @Prop({
    type: String,
    enum: ['stripe', 'vnpay', 'momo'],
    required: true,
  })
  paymentMethod!: string;

  @Prop({
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  })
  paymentStatus!: string;

  @Prop({ default: '' })
  transactionId!: string;

  @Prop({ default: '' })
  sessionId!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
