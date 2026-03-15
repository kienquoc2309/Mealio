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
