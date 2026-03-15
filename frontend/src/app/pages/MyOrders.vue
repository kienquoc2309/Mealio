<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, Loader2, ChefHat, ClipboardCheck } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import type { OrderStatus } from '../types'

const auth = useAuthStore()
const ordersStore = useOrdersStore()

const expandedId = ref<string | null>(null)

const statusConfig: Record<OrderStatus, { label: string; color: string; step: number }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', step: 1 },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', step: 2 },
  preparing: { label: 'Preparing', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300', step: 3 },
  delivering: { label: 'On the Way', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', step: 4 },
  delivered: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', step: 5 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', step: 0 },
}

const statusIcons: Record<OrderStatus, any> = {
  pending: Clock,
  confirmed: ClipboardCheck,
  preparing: ChefHat,
  delivering: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'delivering', label: 'On the Way' },
  { key: 'delivered', label: 'Delivered' },
]

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + '₫'

onMounted(() => {
  if (auth.currentUser) {
    ordersStore.fetchUserOrders()
  }
})

watch(() => auth.currentUser, (user) => {
  if (user) {
    ordersStore.fetchUserOrders()
  }
})
</script>

<template>
  <main v-if="auth.currentUser" class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-20 lg:pt-24 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/profile" class="p-2 bg-white dark:bg-[#182420] border border-gray-200 dark:border-[#263a32] rounded-xl text-gray-500 dark:text-[#7a9e8c] hover:text-green-600 hover:border-green-200 dark:hover:border-green-700 transition-all">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <div>
          <h1 class="text-gray-900 dark:text-[#e2efe8] text-2xl" :style="{ fontWeight: 800 }">My Orders</h1>
          <p class="text-gray-500 dark:text-[#7a9e8c] text-sm">{{ ordersStore.orders.length }} order{{ ordersStore.orders.length !== 1 ? 's' : '' }} placed</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="ordersStore.loading" class="flex items-center justify-center py-20">
        <Loader2 class="w-6 h-6 text-green-600 animate-spin" />
        <span class="text-gray-500 dark:text-[#7a9e8c] ml-3">Loading orders...</span>
      </div>

      <!-- Error -->
      <div v-else-if="ordersStore.error" class="bg-white dark:bg-[#182420] rounded-2xl shadow-sm border border-gray-100 dark:border-[#263a32] p-12 text-center">
        <p class="text-red-500 text-sm mb-4">{{ ordersStore.error }}</p>
        <button @click="ordersStore.fetchUserOrders()" class="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm" :style="{ fontWeight: 700 }">
          Try Again
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="ordersStore.orders.length === 0" class="bg-white dark:bg-[#182420] rounded-2xl shadow-sm border border-gray-100 dark:border-[#263a32] p-12 text-center">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package class="w-8 h-8 text-green-500" />
        </div>
        <h3 class="text-gray-900 dark:text-[#e2efe8] text-lg mb-2" :style="{ fontWeight: 700 }">No orders yet</h3>
        <p class="text-gray-500 dark:text-[#7a9e8c] text-sm mb-6">Start ordering from our delicious menu!</p>
        <router-link to="/menu" class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm" :style="{ fontWeight: 700 }">
          Browse Menu
        </router-link>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-4">
        <div
          v-for="order in ordersStore.orders"
          :key="order._id"
          class="bg-white dark:bg-[#182420] rounded-2xl shadow-sm border border-gray-100 dark:border-[#263a32] overflow-hidden"
        >
          <!-- Order Header -->
          <div
            class="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e2e28] transition-colors"
            @click="expandedId = expandedId === order._id ? null : order._id"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="text-gray-900 dark:text-[#e2efe8] text-sm" :style="{ fontWeight: 700 }">{{ order._id.slice(-8).toUpperCase() }}</span>
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs', statusConfig[order.orderStatus as OrderStatus]?.color]" :style="{ fontWeight: 600 }">
                    <component :is="statusIcons[order.orderStatus as OrderStatus]" class="w-3.5 h-3.5" />
                    {{ statusConfig[order.orderStatus as OrderStatus]?.label }}
                  </span>
                </div>
                <p class="text-gray-400 dark:text-[#5a7e6c] text-xs">{{ formatDate(order.createdAt) }}</p>
                <p class="text-gray-500 dark:text-[#7a9e8c] text-xs mt-1">
                  {{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }} ·
                  <span class="text-green-600 dark:text-green-400" :style="{ fontWeight: 700 }">{{ formatPrice(order.totalAmount) }}</span>
                </p>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <div class="hidden sm:flex -space-x-2">
                  <img v-for="item in order.items.slice(0, 3)" :key="item.foodId" :src="item.image" :alt="item.name" class="w-9 h-9 rounded-lg object-cover border-2 border-white dark:border-[#182420]" />
                  <div v-if="order.items.length > 3" class="w-9 h-9 rounded-lg bg-gray-100 dark:bg-[#263a32] border-2 border-white dark:border-[#182420] flex items-center justify-center">
                    <span class="text-xs text-gray-500 dark:text-[#7a9e8c]" :style="{ fontWeight: 600 }">+{{ order.items.length - 3 }}</span>
                  </div>
                </div>
                <ChevronUp v-if="expandedId === order._id" class="w-4 h-4 text-gray-400 dark:text-[#7a9e8c]" />
                <ChevronDown v-else class="w-4 h-4 text-gray-400 dark:text-[#7a9e8c]" />
              </div>
            </div>

            <!-- Progress bar -->
            <div v-if="order.orderStatus !== 'cancelled'" class="mt-4">
              <div class="flex items-center gap-0">
                <div v-for="(step, idx) in STEPS" :key="step.key" class="flex items-center flex-1">
                  <div :class="['w-3 h-3 rounded-full flex-shrink-0 transition-colors', statusConfig[order.orderStatus as OrderStatus]?.step >= idx + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-[#263a32]']" />
                  <div v-if="idx !== STEPS.length - 1" :class="['flex-1 h-0.5 transition-colors', statusConfig[order.orderStatus as OrderStatus]?.step >= idx + 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-[#263a32]']" />
                </div>
              </div>
              <div class="flex justify-between mt-1">
                <span
                  v-for="(step, idx) in STEPS"
                  :key="step.key"
                  :class="['text-[10px]', statusConfig[order.orderStatus as OrderStatus]?.step >= idx + 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-[#5a7e6c]']"
                  :style="{ fontWeight: statusConfig[order.orderStatus as OrderStatus]?.step >= idx + 1 ? 600 : 400 }"
                >
                  {{ step.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Expanded details -->
          <div v-if="expandedId === order._id" class="border-t border-gray-100 dark:border-[#263a32] px-5 py-4 bg-gray-50 dark:bg-[#101a16]">
            <p class="text-xs text-gray-500 dark:text-[#7a9e8c] mb-3" :style="{ fontWeight: 600 }">ORDER ITEMS</p>
            <div class="space-y-3 mb-4">
              <div v-for="item in order.items" :key="item.foodId" class="flex items-center gap-3">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 dark:text-[#e2efe8] text-sm truncate" :style="{ fontWeight: 600 }">{{ item.name }}</p>
                  <p class="text-gray-400 dark:text-[#5a7e6c] text-xs">{{ formatPrice(item.price) }} × {{ item.quantity }}</p>
                </div>
                <span class="text-gray-900 dark:text-[#e2efe8] text-sm flex-shrink-0" :style="{ fontWeight: 700 }">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-[#263a32] pt-3 space-y-1.5">
              <div class="flex justify-between text-xs text-gray-500 dark:text-[#7a9e8c]">
                <span>Subtotal</span>
                <span>{{ formatPrice(order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)) }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-500 dark:text-[#7a9e8c]">
                <span>Delivery Fee</span>
                <span :class="order.feeShip === 0 ? 'text-green-500' : ''">{{ order.feeShip === 0 ? 'FREE' : formatPrice(order.feeShip) }}</span>
              </div>
              <div class="flex justify-between text-sm pt-1 border-t border-gray-200 dark:border-[#263a32]">
                <span class="text-gray-900 dark:text-[#e2efe8]" :style="{ fontWeight: 700 }">Total</span>
                <span class="text-green-600 dark:text-green-400" :style="{ fontWeight: 800 }">{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-[#263a32]">
              <p class="text-xs text-gray-500 dark:text-[#7a9e8c]">
                <span :style="{ fontWeight: 600 }">{{ order.address.receiverName }}</span> · {{ order.address.phone }}
              </p>
              <p class="text-xs text-gray-400 dark:text-[#5a7e6c] mt-0.5">{{ order.address.street }}, {{ order.address.city }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
