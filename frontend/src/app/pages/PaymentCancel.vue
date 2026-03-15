<script setup lang="ts">
import { XCircle, ChevronRight, ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-24 flex items-center justify-center px-4">
    <div class="text-center max-w-sm">
      <div class="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle class="w-10 h-10 text-orange-500" />
      </div>
      <h2 class="text-gray-900 dark:text-[#e2efe8] text-2xl mb-3" :style="{ fontWeight: 800 }">Payment Cancelled</h2>
      <p class="text-gray-500 dark:text-[#7a9e8c] text-sm mb-8">
        Your payment was cancelled. Your order is still pending — you can retry the payment from your orders page.
      </p>
      <div class="flex flex-col gap-3">
        <router-link
          to="/my-orders"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all text-sm"
          :style="{ fontWeight: 700 }"
        >
          View My Orders
          <ChevronRight class="w-4 h-4" />
        </router-link>
        <router-link
          to="/menu"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-[#263a32] text-gray-600 dark:text-[#7a9e8c] rounded-xl hover:border-green-200 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400 transition-all text-sm"
          :style="{ fontWeight: 600 }"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Menu
        </router-link>
      </div>
    </div>
  </main>
</template>
