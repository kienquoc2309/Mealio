import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../users/schemas/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private configService: ConfigService,
  ) {}

  private createAccessToken(userId: string, role: string): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    return jwt.sign({ id: userId, role }, secret!, { expiresIn: '15m' });
  }

  private createRefreshTokenString(userId: string, role: string): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return jwt.sign({ id: userId, role }, secret!, { expiresIn: '7d' });
  }

  private async createTokens(userId: string, role: string) {
    const accessToken = this.createAccessToken(userId, role);
    const refreshToken = this.createRefreshTokenString(userId, role);

    await this.refreshTokenModel.create({
      userId: new Types.ObjectId(userId),
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Please enter a valid email');
    }

    if (password.length < 8) {
      throw new Error('Please enter password >8 characters');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      cart: [],
    });

    const tokens = await this.createTokens(user._id.toString(), user.role);

    return { success: true, ...tokens, message: 'Register successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Email/password in correct, please check your info');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Email/password in correct, please check your info');
    }

    const tokens = await this.createTokens(user._id.toString(), user.role);

    return { success: true, ...tokens };
  }

  async refreshToken(refreshToken: string) {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    try {
      const payload = jwt.verify(refreshToken, secret!) as { id: string };

      const storedToken = await this.refreshTokenModel.findOne({
        token: refreshToken,
        userId: payload.id,
      });

      if (!storedToken) {
        throw new Error('Refresh token not found');
      }

      if (storedToken.expiresAt < new Date()) {
        await storedToken.deleteOne();
        throw new Error('Refresh token expired');
      }

      await storedToken.deleteOne();

      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new Error('User not found');
      }

      const tokens = await this.createTokens(payload.id, user.role);

      return { success: true, ...tokens };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Invalid refresh token',
      );
    }
  }

  async logout(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    await this.refreshTokenModel.deleteMany({ userId: user._id });
    return { success: true, message: 'Logged out successfully' };
  }
}
