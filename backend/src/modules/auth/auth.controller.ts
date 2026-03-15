import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(refreshTokenDto.refreshToken);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Body('email') email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.authService.logout(email);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  // --- Email Verification ---

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      return await this.authService.verifyEmail(token);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('resend-verification')
  @HttpCode(200)
  async resendVerification(@Body('email') email: string) {
    try {
      return await this.authService.resendVerificationEmail(email);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  // --- Forgot / Reset Password ---

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(forgotPasswordDto.email);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.password,
      );
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  // --- Google OAuth ---

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  googleLogin() {
    // Redirects to Google
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const frontendUrl = this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );
    try {
      const result = await this.authService.handleOAuthUser(req.user);
      res.redirect(
        `${frontendUrl}/oauth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`,
      );
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }

  // --- Facebook OAuth ---

  @Get('facebook')
  @UseGuards(PassportAuthGuard('facebook'))
  facebookLogin() {
    // Redirects to Facebook
  }

  @Get('facebook/callback')
  @UseGuards(PassportAuthGuard('facebook'))
  async facebookCallback(@Req() req: any, @Res() res: any) {
    const frontendUrl = this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );
    try {
      const result = await this.authService.handleOAuthUser(req.user);
      res.redirect(
        `${frontendUrl}/oauth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`,
      );
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
}
