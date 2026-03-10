<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import type { OrderStatus } from '../data/mockOrders'

const auth = useAuthStore()

const expandedId = ref<string | null>(null)

const statusConfig: Record<OrderStatus, { label: string; color: string; step: number }> = {
  Pending: { label: 'Pending', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', step: 1 },
  Preparing: { label: 'Preparing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', step: 2 },
  'On the Way': { label: 'On the Way', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', step: 3 },
  Delivered: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', step: 4 },
  Cancelled: { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400', step: 0 },
}

const statusIcons: Record<OrderStatus, any> = {
  Pending: Clock,
  Preparing: Package,
  'On the Way': Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle,
}

const STEPS: OrderStatus[] = ['Pending', 'Preparing', 'On the Way', 'Delivered']

const myOrders = computed(() => {
  if (!auth.currentUser) return []
  return auth.orders
    .filter((o) => o.userId === auth.currentUser!.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <main v-if="auth.currentUser" class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/profile" class="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-green-600 hover:border-green-200 transition-all">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <div>
          <h1 class="text-gray-900 dark:text-white text-2xl" :style="{ fontWeight: 800 }">My Orders</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ myOrders.length }} order{{ myOrders.length !== 1 ? 's' : '' }} placed</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="myOrders.length === 0" class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package class="w-8 h-8 text-green-500" />
        </div>
        <h3 class="text-gray-900 dark:text-white text-lg mb-2" :style="{ fontWeight: 700 }">No orders yet</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">Start ordering from our delicious menu!</p>
        <router-link to="/menu" class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm" :style="{ fontWeight: 700 }">
          Browse Menu
        </router-link>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-4">
        <div
          v-for="order in myOrders"
          :key="order.id"
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <!-- Order Header -->
          <div
            class="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            @click="expandedId = expandedId === order.id ? null : order.id"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="text-gray-900 dark:text-white text-sm" :style="{ fontWeight: 700 }">{{ order.id }}</span>
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs', statusConfig[order.status].color]" :style="{ fontWeight: 600 }">
                    <component :is="statusIcons[order.status]" class="w-3.5 h-3.5" />
                    {{ statusConfig[order.status].label }}
                  </span>
                </div>
                <p class="text-gray-400 dark:text-gray-500 text-xs">{{ formatDate(order.date) }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }} ·
                  <span class="text-green-600 dark:text-green-400" :style="{ fontWeight: 700 }">${{ order.total.toFixed(2) }}</span>
                </p>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <div class="hidden sm:flex -space-x-2">
                  <img v-for="item in order.items.slice(0, 3)" :key="item.id" :src="item.image" :alt="item.name" class="w-9 h-9 rounded-lg object-cover border-2 border-white dark:border-gray-900" />
                  <div v-if="order.items.length > 3" class="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <span class="text-xs text-gray-500 dark:text-gray-400" :style="{ fontWeight: 600 }">+{{ order.items.length - 3 }}</span>
                  </div>
                </div>
                <ChevronUp v-if="expandedId === order.id" class="w-4 h-4 text-gray-400" />
                <ChevronDown v-else class="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <!-- Progress bar -->
            <div v-if="order.status !== 'Cancelled'" class="mt-4">
              <div class="flex items-center gap-0">
                <div v-for="(step, idx) in STEPS" :key="step" class="flex items-center flex-1">
                  <div :class="['w-3 h-3 rounded-full flex-shrink-0 transition-colors', statusConfig[order.status].step >= idx + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700']" />
                  <div v-if="idx !== STEPS.length - 1" :class="['flex-1 h-0.5 transition-colors', statusConfig[order.status].step >= idx + 2 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700']" />
                </div>
              </div>
              <div class="flex justify-between mt-1">
                <span
                  v-for="(step, idx) in STEPS"
                  :key="step"
                  :class="['text-[10px]', statusConfig[order.status].step >= idx + 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600']"
                  :style="{ fontWeight: statusConfig[order.status].step >= idx + 1 ? 600 : 400 }"
                >
                  {{ step }}
                </span>
              </div>
            </div>
          </div>

          <!-- Expanded details -->
          <div v-if="expandedId === order.id" class="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-gray-800/30">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3" :style="{ fontWeight: 600 }">ORDER ITEMS</p>
            <div class="space-y-3 mb-4">
              <div v-for="item in order.items" :key="item.id" class="flex items-center gap-3">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-gray-900 dark:text-white text-sm truncate" :style="{ fontWeight: 600 }">{{ item.name }}</p>
                  <p class="text-gray-400 dark:text-gray-500 text-xs">${{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
                </div>
                <span class="text-gray-900 dark:text-white text-sm flex-shrink-0" :style="{ fontWeight: 700 }">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5">
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Subtotal</span><span>${{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span :class="order.deliveryFee === 0 ? 'text-green-500' : ''">{{ order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}` }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Tax (8%)</span><span>${{ order.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm pt-1 border-t border-gray-200 dark:border-gray-700">
                <span class="text-gray-900 dark:text-white" :style="{ fontWeight: 700 }">Total</span>
                <span class="text-green-600 dark:text-green-400" :style="{ fontWeight: 800 }">${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p class="text-xs text-gray-400 dark:text-gray-500">📍 {{ order.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
