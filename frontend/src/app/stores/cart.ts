import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartService } from '../services/cartService'
import { useAuthStore } from './auth'
import type { CartItem, CartItemResponse } from '../types'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref<CartItem[]>([])
  const loading = ref(false)

  const isLoggedIn = () => {
    const auth = useAuthStore()
    return !!auth.currentUser
  }

  const mapResponseToCartItems = (items: CartItemResponse[]): CartItem[] => {
    return items.map((item) => ({
      foodId: item.foodId,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }))
  }

  const fetchCart = async () => {
    if (!isLoggedIn()) return
    loading.value = true
    try {
      const items = await cartService.getCart()
      cartItems.value = mapResponseToCartItems(items)
    } catch {
      // Keep current local cart on error
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (food: { _id?: string; foodId?: string; name: string; price: number; image: string; description?: string }) => {
    const foodId = food._id || food.foodId
    if (!foodId) return

    if (isLoggedIn()) {
      try {
        const items = await cartService.addToCart(foodId, 1)
        cartItems.value = mapResponseToCartItems(items)
      } catch {
        // Fallback to local
        addLocal(foodId, food)
      }
    } else {
      addLocal(foodId, food)
    }
  }

  const addLocal = (foodId: string, food: { name: string; price: number; image: string; description?: string }) => {
    const existing = cartItems.value.find((item) => item.foodId === foodId)
    if (existing) {
      existing.quantity++
    } else {
      cartItems.value.push({
        foodId,
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
        quantity: 1,
      })
    }
  }

  const removeFromCart = async (foodId: string) => {
    if (isLoggedIn()) {
      try {
        const items = await cartService.removeFromCart(foodId)
        cartItems.value = mapResponseToCartItems(items)
      } catch {
        cartItems.value = cartItems.value.filter((item) => item.foodId !== foodId)
      }
    } else {
      cartItems.value = cartItems.value.filter((item) => item.foodId !== foodId)
    }
  }

  const updateQuantity = async (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(foodId)
    }

    if (isLoggedIn()) {
      try {
        const items = await cartService.updateQuantity(foodId, quantity)
        cartItems.value = mapResponseToCartItems(items)
      } catch {
        const item = cartItems.value.find((item) => item.foodId === foodId)
        if (item) item.quantity = quantity
      }
    } else {
      const item = cartItems.value.find((item) => item.foodId === foodId)
      if (item) item.quantity = quantity
    }
  }

  const clearCart = async () => {
    if (isLoggedIn()) {
      try {
        await cartService.clearCart()
      } catch {
        // Clear locally anyway
      }
    }
    cartItems.value = []
  }

  const totalItems = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    totalItems,
    totalPrice,
  }
})
