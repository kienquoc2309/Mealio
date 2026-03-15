import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../users/schemas/refresh-token.schema';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private configService: ConfigService,
    private emailService: EmailService,
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

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      cart: [],
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      authProvider: 'local',
    });

    // Send verification email (don't block registration if it fails)
    try {
      await this.emailService.sendVerificationEmail(email, verificationToken);
    } catch {
      // Email sending failed — user can request resend later
    }

    const tokens = await this.createTokens(user._id.toString(), user.role);

    return {
      success: true,
      ...tokens,
      message:
        'Register successfully. Please check your email to verify your account.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Email/password in correct, please check your info');
    }

    // Block login for OAuth-only users who haven't set a password
    if (user.authProvider !== 'local' && !user.password) {
      throw new Error(
        `This account uses ${user.authProvider} login. Please sign in with ${user.authProvider}.`,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Email/password in correct, please check your info');
    }

    const tokens = await this.createTokens(user._id.toString(), user.role);

    return { success: true, ...tokens };
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification link');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return { success: true, message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    await user.save();

    await this.emailService.sendVerificationEmail(email, verificationToken);

    return { success: true, message: 'Verification email sent' };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return {
        success: true,
        message: 'If the email exists, a reset link has been sent',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
    } catch {
      // Clear token if email fails — user can retry
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw new Error('Failed to send reset email. Please try again later.');
    }

    return {
      success: true,
      message: 'If the email exists, a reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset link');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Invalidate all refresh tokens for security
    await this.refreshTokenModel.deleteMany({ userId: user._id });

    return { success: true, message: 'Password reset successfully' };
  }

  async handleOAuthUser(profile: {
    provider: 'google' | 'facebook';
    providerId: string;
    email: string;
    name: string;
  }) {
    const providerIdField =
      profile.provider === 'google' ? 'googleId' : 'facebookId';

    // Check if user exists by provider ID
    let user = await this.userModel.findOne({
      [providerIdField]: profile.providerId,
    });

    if (!user) {
      // Check if user exists by email
      user = await this.userModel.findOne({ email: profile.email });

      if (user) {
        // Link OAuth to existing account
        user[providerIdField] = profile.providerId;
        if (!user.isEmailVerified) {
          user.isEmailVerified = true;
        }
        await user.save();
      } else {
        // Create new user
        user = await this.userModel.create({
          name: profile.name,
          email: profile.email,
          password: '',
          role: 'user',
          cart: [],
          isEmailVerified: true,
          authProvider: profile.provider,
          [providerIdField]: profile.providerId,
        });
      }
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
