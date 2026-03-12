import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAllFoods(): Promise<FoodDocument[]> {
    return this.foodModel
      .find()
      .populate('categoryId', 'name icon image')
      .exec();
  }

  async getFoodById(id: string): Promise<FoodDocument> {
    const food = await this.foodModel
      .findById(id)
      .populate('categoryId', 'name icon image')
      .exec();
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  async createFood(dto: CreateFoodDto): Promise<FoodDocument> {
    const category = await this.categoryModel.findById(dto.categoryId).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const food = new this.foodModel({
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
    });
    const saved = await food.save();
    return saved.populate('categoryId', 'name icon image');
  }

  async updateFood(id: string, dto: UpdateFoodDto): Promise<FoodDocument> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.categoryId) {
      const category = await this.categoryModel.findById(dto.categoryId).exec();
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      updateData.categoryId = new Types.ObjectId(dto.categoryId);
    }

    const food = await this.foodModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('categoryId', 'name icon image')
      .exec();
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  async deleteFood(id: string): Promise<void> {
    const result = await this.foodModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Food not found');
    }
  }

  async getAllCategories(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().exec();
  }
}
