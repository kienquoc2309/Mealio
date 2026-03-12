import api from './api'

export interface FoodCategory {
  _id: string
  name: string
  icon: string
  image: string
}

export interface FoodItem {
  _id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: FoodCategory | string
  isAvailable: boolean
  rating: number
  reviews: number
  tag?: string
  createdAt: string
  updatedAt: string
}

export interface CreateFoodPayload {
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  isAvailable?: boolean
  rating?: number
  reviews?: number
  tag?: string
}

export interface UpdateFoodPayload {
  name?: string
  description?: string
  price?: number
  image?: string
  categoryId?: string
  isAvailable?: boolean
  rating?: number
  reviews?: number
  tag?: string
}

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
