import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return { success: true, user };
  }

  async updateProfile(userId: string, data: { name?: string }) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, data, { new: true })
      .select('-password')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return { success: true, user, message: 'Profile updated successfully' };
  }
}
