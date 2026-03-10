import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Dish } from '../data/menuData'

export interface CartItem extends Dish {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])

  const addToCart = (dish: Dish) => {
    const existing = cartItems.value.find((item) => item.id === dish.id)
    if (existing) {
      existing.quantity++
    } else {
      cartItems.value.push({ ...dish, quantity: 1 })
    }
  }

  const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id)
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    const item = cartItems.value.find((item) => item.id === id)
    if (item) {
      item.quantity = quantity
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const totalItems = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }
})
