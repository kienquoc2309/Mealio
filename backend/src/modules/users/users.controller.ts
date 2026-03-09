import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest) {
    try {
      return await this.usersService.getProfile(req.userId);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @UseGuards(AuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name?: string },
  ) {
    try {
      return await this.usersService.updateProfile(req.userId, body);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
