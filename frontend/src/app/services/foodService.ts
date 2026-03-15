import api from './api'
import type { FoodCategory, FoodItem, CreateFoodPayload, UpdateFoodPayload } from '../types'

export const foodService = {
  async getAllFoods(): Promise<FoodItem[]> {
    const { data } = await api.get<{ success: boolean; foods: FoodItem[] }>('/foods')
    return data.foods
  },

  async getFoodById(id: string): Promise<FoodItem> {
    const { data } = await api.get<{ success: boolean; food: FoodItem }>(`/foods/${id}`)
    return data.food
  },

  async getAllCategories(): Promise<FoodCategory[]> {
    const { data } = await api.get<{ success: boolean; categories: FoodCategory[] }>('/foods/categories')
    return data.categories
  },

  async createFood(payload: CreateFoodPayload): Promise<FoodItem> {
    const { data } = await api.post<{ success: boolean; food: FoodItem }>('/foods', payload)
    return data.food
  },

  async updateFood(id: string, payload: UpdateFoodPayload): Promise<FoodItem> {
    const { data } = await api.patch<{ success: boolean; food: FoodItem }>(`/foods/${id}`, payload)
    return data.food
  },

  async deleteFood(id: string): Promise<void> {
    await api.delete(`/foods/${id}`)
  },
}
