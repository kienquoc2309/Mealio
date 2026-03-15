import api from './api'
import type { OrderAddress, OrderResponse, PlaceOrderResponse } from '../types'

export const orderService = {
  async placeOrder(address: OrderAddress, paymentMethod: string): Promise<PlaceOrderResponse> {
    const { data } = await api.post<PlaceOrderResponse>('/orders/placeOrder', {
      address,
      paymentMethod,
    })
    return data
  },

  async verifyOrder(sessionId: string): Promise<{ success: boolean; order: OrderResponse }> {
    const { data } = await api.post<{ success: boolean; order: OrderResponse }>(
      `/orders/verifyOrder?session_id=${sessionId}`,
    )
    return data
  },

  async getUserOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get<{ success: boolean; orders: OrderResponse[] }>(
      '/orders/userOrders',
    )
    return data.orders
  },

  async listAllOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get<{ success: boolean; orders: OrderResponse[] }>(
      '/orders/listOrders',
    )
    return data.orders
  },

  async updateStatus(orderId: string, orderStatus: string): Promise<OrderResponse> {
    const { data } = await api.patch<{ success: boolean; order: OrderResponse; message: string }>(
      '/orders/updateStatus',
      { orderId, orderStatus },
    )
    return data.order
  },
}
