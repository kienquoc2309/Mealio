import api from './api'
import type { CartItemResponse } from '../types'

export const cartService = {
  async getCart(): Promise<CartItemResponse[]> {
    const { data } = await api.get<{ success: boolean; cart: CartItemResponse[] }>('/cart')
    return data.cart
  },

  async addToCart(foodId: string, quantity: number = 1): Promise<CartItemResponse[]> {
    const { data } = await api.post<{ success: boolean; cart: CartItemResponse[] }>('/cart/add', {
      foodId,
      quantity,
    })
    return data.cart
  },

  async removeFromCart(foodId: string): Promise<CartItemResponse[]> {
    const { data } = await api.delete<{ success: boolean; cart: CartItemResponse[] }>(
      `/cart/remove/${foodId}`,
    )
    return data.cart
  },

  async updateQuantity(foodId: string, quantity: number): Promise<CartItemResponse[]> {
    const { data } = await api.patch<{ success: boolean; cart: CartItemResponse[] }>(
      `/cart/update/${foodId}`,
      { quantity },
    )
    return data.cart
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart/clear')
  },
}
