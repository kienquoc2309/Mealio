import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, CartItem } from '../users/schemas/user.schema';
import { Food, FoodDocument } from '../foods/schemas/food.schema';

interface PopulatedCartItem {
  foodId: Food & { _id: Types.ObjectId };
  quantity: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
  ) {}

  async getCart(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('cart.foodId')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cartItems = (user.cart as unknown as PopulatedCartItem[])
      .filter((item) => item.foodId !== null)
      .map((item) => ({
        foodId: item.foodId._id,
        name: item.foodId.name,
        description: item.foodId.description,
        price: item.foodId.price,
        image: item.foodId.image,
        quantity: item.quantity,
      }));

    return { success: true, cart: cartItems };
  }

  async addToCart(userId: string, foodId: string, quantity: number) {
    if (!Types.ObjectId.isValid(foodId)) {
      throw new BadRequestException('Invalid food ID');
    }

    const food = await this.foodModel.findById(foodId).lean();
    if (!food) {
      throw new NotFoundException('Food not found');
    }

    if (food.isAvailable === false) {
      throw new BadRequestException('This food is currently unavailable');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingIndex = user.cart.findIndex(
      (item) => item.foodId.toString() === foodId,
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({
        foodId: new Types.ObjectId(foodId),
        quantity,
      });
    }

    await user.save();

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, foodId: string) {
    if (!Types.ObjectId.isValid(foodId)) {
      throw new BadRequestException('Invalid food ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) => item.foodId.toString() !== foodId,
    ) as Types.DocumentArray<CartItem>;

    if (user.cart.length === initialLength) {
      throw new NotFoundException('Item not found in cart');
    }

    await user.save();

    return this.getCart(userId);
  }

  async updateQuantity(userId: string, foodId: string, quantity: number) {
    if (!Types.ObjectId.isValid(foodId)) {
      throw new BadRequestException('Invalid food ID');
    }

    if (quantity <= 0) {
      return this.removeFromCart(userId, foodId);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cartItem = user.cart.find(
      (item) => item.foodId.toString() === foodId,
    );

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    cartItem.quantity = quantity;
    await user.save();

    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.cart = [] as unknown as Types.DocumentArray<CartItem>;
    await user.save();

    return { success: true, cart: [] };
  }
}
