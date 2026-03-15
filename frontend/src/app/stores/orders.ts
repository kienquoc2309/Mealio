import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderService } from '../services/orderService'
import type { OrderResponse, OrderAddress } from '../types'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<OrderResponse[]>([])
  const loading = ref(false)
  const placing = ref(false)
  const error = ref('')

  const fetchUserOrders = async () => {
    loading.value = true
    error.value = ''
    try {
      orders.value = await orderService.getUserOrders()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load orders'
    } finally {
      loading.value = false
    }
  }

  const placeOrder = async (
    address: OrderAddress,
    paymentMethod: string,
  ): Promise<{ success: boolean; message: string; paymentUrl?: string }> => {
    placing.value = true
    error.value = ''
    try {
      const result = await orderService.placeOrder(address, paymentMethod)
      orders.value.unshift(result.order)

      if (result.paymentUrl) {
        return { success: true, message: 'Redirecting to payment...', paymentUrl: result.paymentUrl }
      }

      return { success: true, message: 'Order placed successfully!' }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to place order'
      return { success: false, message }
    } finally {
      placing.value = false
    }
  }

  const verifyOrder = async (sessionId: string): Promise<{ success: boolean; order?: OrderResponse }> => {
    try {
      const result = await orderService.verifyOrder(sessionId)
      return { success: true, order: result.order }
    } catch {
      return { success: false }
    }
  }

  return {
    orders,
    loading,
    placing,
    error,
    fetchUserOrders,
    placeOrder,
    verifyOrder,
  }
})
