import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  async getAllFoods() {
    const foods = await this.foodsService.getAllFoods();
    return { success: true, foods };
  }

  @Get('categories')
  async getAllCategories() {
    const categories = await this.foodsService.getAllCategories();
    return { success: true, categories };
  }

  @Get(':id')
  async getFoodById(@Param('id') id: string) {
    const food = await this.foodsService.getFoodById(id);
    return { success: true, food };
  }

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  async createFood(@Body() dto: CreateFoodDto) {
    const food = await this.foodsService.createFood(dto);
    return { success: true, message: 'Food created successfully', food };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async updateFood(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    const food = await this.foodsService.updateFood(id, dto);
    return { success: true, message: 'Food updated successfully', food };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async deleteFood(@Param('id') id: string) {
    await this.foodsService.deleteFood(id);
    return { success: true, message: 'Food deleted successfully' };
  }
}
