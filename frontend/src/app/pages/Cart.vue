<script setup lang="ts">
import { computed } from 'vue'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, ChevronRight } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

const deliveryFee = computed(() => cart.totalPrice > 25 ? 0 : 3.99)
const tax = computed(() => cart.totalPrice * 0.08)
const total = computed(() => cart.totalPrice + deliveryFee.value + tax.value)
</script>

<template>
  <!-- Empty Cart -->
  <main v-if="cart.cartItems.length === 0" class="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
    <div class="text-center max-w-sm">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag class="w-10 h-10 text-green-500" />
      </div>
      <h2 class="text-gray-900 text-2xl mb-3" :style="{ fontWeight: 800 }">Your cart is empty</h2>
      <p class="text-gray-500 text-sm mb-8">
        Looks like you haven't added anything yet. Browse our delicious menu and add your favorites!
      </p>
      <router-link
        to="/menu"
        class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all text-sm"
        :style="{ fontWeight: 700 }"
      >
        Browse Menu
        <ChevronRight class="w-4 h-4" />
      </router-link>
    </div>
  </main>

  <!-- Filled Cart -->
  <main v-else class="min-h-screen bg-gray-50 pt-20 lg:pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <router-link to="/menu" class="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-green-600 hover:border-green-200 transition-all">
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          <div>
            <h1 class="text-gray-900 text-2xl" :style="{ fontWeight: 800 }">Your Cart</h1>
            <p class="text-gray-500 text-sm">{{ cart.totalItems }} item{{ cart.totalItems !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <button @click="cart.clearCart()" class="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-500 transition-colors" :style="{ fontWeight: 600 }">
          <Trash2 class="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cart.cartItems"
            :key="item.id"
            class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center"
          >
            <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="text-gray-900 text-sm mb-1 truncate" :style="{ fontWeight: 700 }">{{ item.name }}</h3>
              <p class="text-green-600 text-base" :style="{ fontWeight: 800 }">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <p class="text-gray-400 text-xs">${{ item.price.toFixed(2) }} each</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button @click="cart.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-lg flex items-center justify-center transition-colors">
                <Minus class="w-3.5 h-3.5" />
              </button>
              <span class="w-6 text-center text-gray-900 text-sm" :style="{ fontWeight: 700 }">{{ item.quantity }}</span>
              <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 bg-gray-100 hover:bg-green-100 hover:text-green-600 rounded-lg flex items-center justify-center transition-colors">
                <Plus class="w-3.5 h-3.5" />
              </button>
              <button @click="cart.removeFromCart(item.id)" class="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors ml-1">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div class="flex items-center gap-2 mb-3">
              <Tag class="w-4 h-4 text-green-600" />
              <span class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">Promo Code</span>
            </div>
            <div class="flex gap-3">
              <input type="text" placeholder="Enter promo code..." class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-300 placeholder-gray-400" />
              <button class="px-4 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 active:scale-95 transition-all" :style="{ fontWeight: 600 }">
                Apply
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 class="text-gray-900 text-base mb-5" :style="{ fontWeight: 800 }">Order Summary</h2>
            <div class="space-y-3 mb-5">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Subtotal ({{ cart.totalItems }} items)</span>
                <span class="text-gray-900" :style="{ fontWeight: 600 }">${{ cart.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Delivery Fee</span>
                <span :class="deliveryFee === 0 ? 'text-green-500' : 'text-gray-900'" :style="{ fontWeight: 600 }">
                  {{ deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}` }}
                </span>
              </div>
              <p v-if="deliveryFee === 0" class="text-xs text-green-500" :style="{ fontWeight: 500 }">
                You saved $3.99 on delivery!
              </p>
              <p v-if="deliveryFee > 0" class="text-xs text-gray-400">
                Add ${{ (25 - cart.totalPrice).toFixed(2) }} more for free delivery
              </p>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Tax (8%)</span>
                <span class="text-gray-900" :style="{ fontWeight: 600 }">${{ tax.toFixed(2) }}</span>
              </div>
            </div>
            <div class="border-t border-gray-100 pt-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-900" :style="{ fontWeight: 700 }">Total</span>
                <span class="text-green-600 text-lg" :style="{ fontWeight: 800 }">${{ total.toFixed(2) }}</span>
              </div>
            </div>
            <button class="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200 text-sm" :style="{ fontWeight: 700 }">
              Proceed to Checkout
            </button>
            <router-link to="/menu" class="flex items-center justify-center gap-2 w-full mt-3 py-3 border border-gray-200 text-gray-600 rounded-xl hover:border-green-200 hover:text-green-600 transition-all text-sm" :style="{ fontWeight: 600 }">
              <ArrowLeft class="w-4 h-4" />
              Continue Shopping
            </router-link>
            <div class="mt-5 p-4 bg-green-50 rounded-xl">
              <p class="text-xs text-green-700" :style="{ fontWeight: 700 }">Estimated Delivery</p>
              <p class="text-green-900 text-sm mt-0.5" :style="{ fontWeight: 600 }">25 - 35 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
