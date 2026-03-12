import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.getCart(req.userId);
  }

  @Post('add')
  async addToCart(
    @Req() req: AuthenticatedRequest,
    @Body() body: AddToCartDto,
  ) {
    return this.cartService.addToCart(req.userId, body.foodId, body.quantity);
  }

  @Delete('remove/:foodId')
  async removeFromCart(
    @Req() req: AuthenticatedRequest,
    @Param('foodId') foodId: string,
  ) {
    return this.cartService.removeFromCart(req.userId, foodId);
  }

  @Patch('update/:foodId')
  async updateQuantity(
    @Req() req: AuthenticatedRequest,
    @Param('foodId') foodId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateQuantity(req.userId, foodId, quantity);
  }

  @Delete('clear')
  async clearCart(@Req() req: AuthenticatedRequest) {
    return this.cartService.clearCart(req.userId);
  }
}
