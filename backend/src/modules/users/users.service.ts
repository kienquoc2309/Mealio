import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
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

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string;
      address?: { street?: string; city?: string };
    },
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, data, { returnDocument: 'after' })
      .select('-password')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return { success: true, user, message: 'Profile updated successfully' };
  }

  async getAllUsers() {
    const users = await this.userModel
      .find()
      .select('-password -cart')
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, users };
  }

  async adminUpdateUser(
    userId: string,
    data: { role?: string; password?: string },
  ) {
    const updateData: Record<string, unknown> = {};

    if (data.role && ['user', 'admin'].includes(data.role)) {
      updateData.role = data.role;
    }

    if (data.password) {
      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No valid fields to update');
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, updateData, { returnDocument: 'after' })
      .select('-password -cart')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    return { success: true, user, message: 'User updated successfully' };
  }

  async deleteUser(userId: string, adminId: string) {
    if (userId === adminId) {
      throw new Error('Cannot delete your own account');
    }

    const user = await this.userModel.findByIdAndDelete(userId).lean();

    if (!user) {
      throw new Error('User not found');
    }

    return { success: true, message: 'User deleted successfully' };
  }
}
