import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
