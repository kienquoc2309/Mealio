<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle2, ChevronRight, Loader2, XCircle } from 'lucide-vue-next'
import { useOrdersStore } from '../stores/orders'

const route = useRoute()
const ordersStore = useOrdersStore()

const verifying = ref(true)
const verified = ref(false)
const error = ref('')

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

onMounted(async () => {
  const resultCode = route.query.resultCode as string
  const orderId = route.query.orderId as string

  if (!resultCode || !orderId) {
    error.value = 'Invalid payment response'
    verifying.value = false
    return
  }

  // MoMo resultCode 0 means payment was successful
  if (resultCode !== '0') {
    error.value = resultCode === '1006'
      ? 'You cancelled the payment. Your order is still pending — you can retry from your orders page.'
      : 'Payment failed. Please try again or choose a different payment method.'
    verifying.value = false
    return
  }

  // Payment reported as successful by MoMo — poll order status
  // to confirm the IPN callback has updated the backend
  const MAX_RETRIES = 8
  const RETRY_DELAY = 2000

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    await ordersStore.fetchUserOrders()
    const order = ordersStore.orders.find(o => o._id === orderId)

    if (order?.paymentStatus === 'paid') {
      verified.value = true
      verifying.value = false
      return
    }

    if (order?.paymentStatus === 'failed') {
      break
    }

    if (attempt < MAX_RETRIES - 1) {
      await sleep(RETRY_DELAY)
    }
  }

  // MoMo already confirmed resultCode=0, so payment is successful
  // even if the IPN hasn't updated the order yet
  verified.value = true
  verifying.value = false
})
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-24 flex items-center justify-center px-4">
    <!-- Verifying -->
    <div v-if="verifying" class="text-center max-w-sm">
      <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <Loader2 class="w-10 h-10 text-green-500 animate-spin" />
      </div>
      <h2 class="text-gray-900 dark:text-[#e2efe8] text-2xl mb-3" :style="{ fontWeight: 800 }">Verifying Payment...</h2>
      <p class="text-gray-500 dark:text-[#7a9e8c] text-sm">Please wait while we confirm your MoMo payment.</p>
    </div>

    <!-- Success -->
    <div v-else-if="verified" class="text-center max-w-sm">
      <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 class="w-10 h-10 text-green-500" />
      </div>
      <h2 class="text-gray-900 dark:text-[#e2efe8] text-2xl mb-3" :style="{ fontWeight: 800 }">Payment Successful!</h2>
      <p class="text-gray-500 dark:text-[#7a9e8c] text-sm mb-8">
        Your payment has been confirmed and your order is being prepared.
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
          Continue Shopping
        </router-link>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center max-w-sm">
      <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle class="w-10 h-10 text-red-500" />
      </div>
      <h2 class="text-gray-900 dark:text-[#e2efe8] text-2xl mb-3" :style="{ fontWeight: 800 }">Payment Failed</h2>
      <p class="text-gray-500 dark:text-[#7a9e8c] text-sm mb-8">{{ error }}</p>
      <div class="flex flex-col gap-3">
        <router-link
          to="/my-orders"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all text-sm"
          :style="{ fontWeight: 700 }"
        >
          Check My Orders
          <ChevronRight class="w-4 h-4" />
        </router-link>
        <router-link
          to="/"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-[#263a32] text-gray-600 dark:text-[#7a9e8c] rounded-xl hover:border-green-200 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400 transition-all text-sm"
          :style="{ fontWeight: 600 }"
        >
          Go Home
        </router-link>
      </div>
    </div>
  </main>
</template>
