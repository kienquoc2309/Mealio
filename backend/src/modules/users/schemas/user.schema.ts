import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Food', required: true })
  foodId!: Types.ObjectId;

  @Prop({ required: true })
  quantity!: number;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Email is not format',
    },
  })
  email!: string;

  @Prop({
    required: function (this: User) {
      return this.authProvider === 'local' || !this.authProvider;
    },
  })
  password!: string;

  @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
  role!: string;

  @Prop({ default: false })
  isEmailVerified!: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationExpires?: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  googleId?: string;

  @Prop()
  facebookId?: string;

  @Prop({ type: String, enum: ['local', 'google', 'facebook'], default: 'local' })
  authProvider!: string;

  @Prop()
  phone?: string;

  @Prop({ type: { street: String, city: String } })
  address?: { street: string; city: string };

  @Prop({
    type: [{ foodId: { type: Types.ObjectId, ref: 'Food' }, quantity: Number }],
    default: [],
  })
  cart!: CartItem[];
}

export const UserSchema = SchemaFactory.createForClass(User);
