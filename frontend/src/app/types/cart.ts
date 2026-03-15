export interface CartItem {
  foodId: string
  name: string
  description?: string
  price: number
  image: string
  quantity: number
}

export interface CartItemResponse {
  foodId: string
  name: string
  description: string
  price: number
  image: string
  quantity: number
}
