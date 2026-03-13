import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
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
    @Body() body: { name?: string; phone?: string; address?: { street?: string; city?: string } },
  ) {
    try {
      return await this.usersService.updateProfile(req.userId, body);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('all-users')
  async getAllUsers() {
    try {
      return await this.usersService.getAllUsers();
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch(':id')
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() body: { role?: string; password?: string },
  ) {
    try {
      return await this.usersService.adminUpdateUser(id, body);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    try {
      return await this.usersService.deleteUser(id, req.userId);
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
}
