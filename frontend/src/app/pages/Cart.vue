<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, ChevronRight, Loader2, MapPin, CheckCircle2, CreditCard } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import type { PaymentMethod } from '../types'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const ordersStore = useOrdersStore()

const receiverName = ref('')
const phone = ref('')
const street = ref('')
const city = ref('')
const phoneError = ref('')
const paymentMethod = ref<PaymentMethod>('stripe')

const paymentOptions: { value: PaymentMethod; label: string; logo: string; description: string; comingSoon?: boolean }[] = [
  { value: 'stripe', label: 'Stripe', logo: '/stripe.svg', description: 'Credit / Debit Card' },
  { value: 'vnpay', label: 'VNPay', logo: '/vnpay.svg', description: 'Vietnamese Bank Transfer' },
  { value: 'momo', label: 'MoMo', logo: '/momo.png', description: 'MoMo E-Wallet' },
]

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('84') && digits.length > 2) {
    return '+84 ' + digits.slice(2).replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3').trim()
  }
  if (digits.startsWith('0') && digits.length > 1) {
    return '+84 ' + digits.slice(1).replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3').trim()
  }
  return '+84 ' + digits.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3').trim()
}

const validatePhone = () => {
  const digits = phone.value.replace(/\D/g, '')
  if (!digits) {
    phoneError.value = ''
    return
  }
  // Vietnamese phone: starts with 0 or 84, total 10 digits (with 0) or 11-12 (with 84)
  const isValid = /^(0[3-9]\d{8}|84[3-9]\d{8}|[3-9]\d{8})$/.test(digits)
  if (!isValid) {
    phoneError.value = 'Please enter a valid Vietnamese phone number'
  } else {
    phoneError.value = ''
    phone.value = formatPhone(digits)
  }
}

const onPhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  // Only allow digits, spaces, + and -
  input.value = input.value.replace(/[^\d\s+\-()]/g, '')
  phone.value = input.value
}

const fillFromProfile = (user: typeof auth.currentUser) => {
  if (!user) return
  if (!receiverName.value) receiverName.value = user.name
  if (!phone.value && user.phone) phone.value = formatPhone(user.phone)
  if (!street.value) street.value = user.address?.street ?? ''
  if (!city.value) city.value = user.address?.city ?? ''
}

onMounted(() => {
  if (auth.currentUser) {
    cart.fetchCart()
    fillFromProfile(auth.currentUser)
  }
})

// Auto-fill when user logs in or profile loads after page is already open
watch(() => auth.currentUser, (user) => {
  if (user) {
    cart.fetchCart()
    fillFromProfile(user)
  }
})

const checkoutError = ref('')
const orderSuccess = ref(false)

const deliveryFee = computed(() => cart.totalPrice > 500000 ? 0 : 30000)
const tax = computed(() => cart.totalPrice * 0.08)
const total = computed(() => cart.totalPrice + deliveryFee.value + tax.value)

const canCheckout = computed(() => {
  return receiverName.value.trim() && phone.value.trim() && street.value.trim() && city.value.trim() && !phoneError.value
})

const handleCheckout = async () => {
  if (!canCheckout.value) {
    checkoutError.value = 'Please fill in all delivery address fields'
    return
  }

  // Strip phone formatting to raw digits for API
  const rawPhone = phone.value.replace(/\D/g, '')
  const result = await ordersStore.placeOrder(
    {
      receiverName: receiverName.value.trim(),
      phone: rawPhone,
      street: street.value.trim(),
      city: city.value.trim(),
    },
    paymentMethod.value,
  )

  if (result.success) {
    cart.cartItems = []
    checkoutError.value = ''

    // Redirect to payment gateway if URL provided (e.g. Stripe)
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl
      return
    }

    orderSuccess.value = true
  } else {
    checkoutError.value = result.message
  }
}

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + '₫'
</script>

<template>
  <!-- Loading -->
  <main v-if="cart.loading" class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-24 flex items-center justify-center px-4">
    <div class="flex items-center gap-3">
      <Loader2 class="w-6 h-6 text-green-600 animate-spin" />
      <span class="text-gray-500 dark:text-[#7a9e8c]">Loading cart...</span>
    </div>
  </main>

  <!-- Empty Cart -->
  <main v-else-if="cart.cartItems.length === 0" class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-24 flex items-center justify-center px-4">
    <div class="text-center max-w-sm">
      <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag class="w-10 h-10 text-green-500" />
      </div>
      <h2 class="text-gray-900 dark:text-[#e2efe8] text-2xl mb-3" :style="{ fontWeight: 800 }">Your cart is empty</h2>
      <p class="text-gray-500 dark:text-[#7a9e8c] text-sm mb-8">
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

  <!-- Order Success -->
  <main v-else-if="orderSuccess" class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-24 flex items-center justify-center px-4">
    <div class="text-center max-w-sm">
      <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 class="w-10 h-10 text-green-500" />
      </div>
      <h2 class="text-gray-900 dark:text-[#e2efe8] text-2xl mb-3" :style="{ fontWeight: 800 }">Order Placed!</h2>
      <p class="text-gray-500 dark:text-[#7a9e8c] text-sm mb-8">
        Your order has been placed successfully. You can track it in your orders page.
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
  </main>

  <!-- Filled Cart -->
  <main v-else class="min-h-screen bg-gray-50 dark:bg-[#0c1210] pt-20 lg:pt-24 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <router-link to="/menu" class="p-2 bg-white dark:bg-[#182420] border border-gray-200 dark:border-[#263a32] rounded-xl text-gray-500 dark:text-[#7a9e8c] hover:text-green-600 hover:border-green-200 dark:hover:border-green-700 transition-all">
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          <div>
            <h1 class="text-gray-900 dark:text-[#e2efe8] text-2xl" :style="{ fontWeight: 800 }">Your Cart</h1>
            <p class="text-gray-500 dark:text-[#7a9e8c] text-sm">{{ cart.totalItems }} item{{ cart.totalItems !== 1 ? 's' : '' }}</p>
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
            :key="item.foodId"
            class="bg-white dark:bg-[#182420] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#263a32] flex gap-4 items-center"
          >
            <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="text-gray-900 dark:text-[#e2efe8] text-sm mb-1 truncate" :style="{ fontWeight: 700 }">{{ item.name }}</h3>
              <p class="text-green-600 dark:text-green-400 text-base" :style="{ fontWeight: 800 }">{{ formatPrice(item.price * item.quantity) }}</p>
              <p class="text-gray-400 dark:text-[#7a9e8c] text-xs">{{ formatPrice(item.price) }} each</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button @click="cart.updateQuantity(item.foodId, item.quantity - 1)" class="w-8 h-8 bg-gray-100 dark:bg-[#263a32] hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-600 dark:text-[#7a9e8c] dark:hover:text-green-400 rounded-lg flex items-center justify-center transition-colors">
                <Minus class="w-3.5 h-3.5" />
              </button>
              <span class="w-6 text-center text-gray-900 dark:text-[#e2efe8] text-sm" :style="{ fontWeight: 700 }">{{ item.quantity }}</span>
              <button @click="cart.updateQuantity(item.foodId, item.quantity + 1)" class="w-8 h-8 bg-gray-100 dark:bg-[#263a32] hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-600 dark:text-[#7a9e8c] dark:hover:text-green-400 rounded-lg flex items-center justify-center transition-colors">
                <Plus class="w-3.5 h-3.5" />
              </button>
              <button @click="cart.removeFromCart(item.foodId)" class="w-8 h-8 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors ml-1">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Delivery Address -->
          <div class="bg-white dark:bg-[#182420] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#263a32]">
            <div class="flex items-center gap-2 mb-4">
              <MapPin class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-gray-900 dark:text-[#e2efe8] text-sm" :style="{ fontWeight: 700 }">Delivery Address</span>
            </div>
            <div class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-[#7a9e8c] mb-1.5" :style="{ fontWeight: 600 }">Receiver Name</label>
                  <input
                    v-model="receiverName"
                    type="text"
                    placeholder="e.g. Nguyen Van A"
                    class="w-full px-4 py-2.5 font-medium border border-gray-200 dark:border-[#263a32] bg-white dark:bg-[#101a16] text-gray-900 dark:text-[#e2efe8] rounded-xl text-sm outline-none focus:border-green-300 dark:focus:border-green-600 placeholder-gray-400 dark:placeholder-[#7a9e8c]"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-[#7a9e8c] mb-1.5" :style="{ fontWeight: 600 }">Phone Number</label>
                  <input
                    v-model="phone"
                    @input="onPhoneInput"
                    @blur="validatePhone"
                    type="tel"
                    placeholder="e.g. 0939 143 228"
                    :class="[
                      'w-full px-4 py-2.5 font-medium border rounded-xl text-sm outline-none placeholder-gray-400 dark:placeholder-[#7a9e8c] bg-white dark:bg-[#101a16] text-gray-900 dark:text-[#e2efe8]',
                      phoneError ? 'border-red-400 dark:border-red-500 focus:border-red-400' : 'border-gray-200 dark:border-[#263a32] focus:border-green-300 dark:focus:border-green-600'
                    ]"
                  />
                  <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-[#7a9e8c] mb-1.5" :style="{ fontWeight: 600 }">Street, Ward (District)</label>
                  <input
                    v-model="street"
                    type="text"
                    placeholder="e.g. 196 Hoang Dieu, District 4"
                    class="w-full px-4 py-2.5 font-medium border border-gray-200 dark:border-[#263a32] bg-white dark:bg-[#101a16] text-gray-900 dark:text-[#e2efe8] rounded-xl text-sm outline-none focus:border-green-300 dark:focus:border-green-600 placeholder-gray-400 dark:placeholder-[#7a9e8c]"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-[#7a9e8c] mb-1.5" :style="{ fontWeight: 600 }">City</label>
                  <input
                    v-model="city"
                    type="text"
                    placeholder="e.g. Ho Chi Minh City"
                    class="w-full px-4 py-2.5 font-medium border border-gray-200 dark:border-[#263a32] bg-white dark:bg-[#101a16] text-gray-900 dark:text-[#e2efe8] rounded-xl text-sm outline-none focus:border-green-300 dark:focus:border-green-600 placeholder-gray-400 dark:placeholder-[#7a9e8c]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white dark:bg-[#182420] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#263a32]">
            <div class="flex items-center gap-2 mb-4">
              <CreditCard class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-gray-900 dark:text-[#e2efe8] text-sm" :style="{ fontWeight: 700 }">Payment Method</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="option in paymentOptions"
                :key="option.value"
                @click="!option.comingSoon && (paymentMethod = option.value)"
                :disabled="option.comingSoon"
                :class="[
                  'relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  option.comingSoon
                    ? 'border-gray-200 dark:border-[#263a32] bg-gray-50 dark:bg-[#101a16] opacity-60 cursor-not-allowed'
                    : paymentMethod === option.value
                      ? 'border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-[#263a32] bg-white dark:bg-[#101a16] hover:border-green-200 dark:hover:border-green-800'
                ]"
              >
                <span v-if="option.comingSoon" class="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] rounded-md" :style="{ fontWeight: 700 }">Coming Soon</span>
                <div class="w-10 h-8 flex items-center justify-center flex-shrink-0">
                  <img :src="option.logo" :alt="option.label" class="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <p :class="['text-sm', option.comingSoon ? 'text-gray-400 dark:text-[#5a7e6c]' : paymentMethod === option.value ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-[#e2efe8]']" :style="{ fontWeight: 700 }">{{ option.label }}</p>
                  <p :class="['text-xs', option.comingSoon ? 'text-gray-300 dark:text-[#4a6e5c]' : paymentMethod === option.value ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-[#7a9e8c]']">{{ option.description }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Promo Code -->
          <div class="bg-white dark:bg-[#182420] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#263a32]">
            <div class="flex items-center gap-2 mb-3">
              <Tag class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-gray-900 dark:text-[#e2efe8] text-sm" :style="{ fontWeight: 700 }">Promo Code</span>
            </div>
            <div class="flex gap-3">
              <input type="text" placeholder="Enter promo code..." class="flex-1 px-4 py-2.5 font-medium border border-gray-200 dark:border-[#263a32] bg-white dark:bg-[#101a16] text-gray-900 dark:text-[#e2efe8] rounded-xl text-sm outline-none focus:border-green-300 dark:focus:border-green-600 placeholder-gray-400 dark:placeholder-[#7a9e8c]" />
              <button class="px-4 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 active:scale-95 transition-all" :style="{ fontWeight: 600 }">
                Apply
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-[#182420] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#263a32] sticky top-24">
            <h2 class="text-gray-900 dark:text-[#e2efe8] text-base mb-5" :style="{ fontWeight: 800 }">Order Summary</h2>
            <div class="space-y-3 mb-5">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-[#7a9e8c]">Subtotal ({{ cart.totalItems }} items)</span>
                <span class="text-gray-900 dark:text-[#e2efe8]" :style="{ fontWeight: 600 }">{{ formatPrice(cart.totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-[#7a9e8c]">Delivery Fee</span>
                <span :class="deliveryFee === 0 ? 'text-green-500' : 'text-gray-900 dark:text-[#e2efe8]'" :style="{ fontWeight: 600 }">
                  {{ deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee) }}
                </span>
              </div>
              <p v-if="deliveryFee === 0" class="text-xs text-green-500" :style="{ fontWeight: 500 }">
                You saved {{ formatPrice(30000) }} on delivery!
              </p>
              <p v-if="deliveryFee > 0" class="text-xs text-gray-400 dark:text-[#7a9e8c]">
                Add {{ formatPrice(500000 - cart.totalPrice) }} more for free delivery
              </p>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500 dark:text-[#7a9e8c]">Tax (8%)</span>
                <span class="text-gray-900 dark:text-[#e2efe8]" :style="{ fontWeight: 600 }">{{ formatPrice(tax) }}</span>
              </div>
            </div>
            <div class="border-t border-gray-100 dark:border-[#263a32] pt-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-900 dark:text-[#e2efe8]" :style="{ fontWeight: 700 }">Total</span>
                <span class="text-green-600 dark:text-green-400 text-lg" :style="{ fontWeight: 800 }">{{ formatPrice(total) }}</span>
              </div>
            </div>
            <p v-if="checkoutError" class="text-red-500 text-xs mb-3">{{ checkoutError }}</p>
            <button
              @click="handleCheckout"
              :disabled="ordersStore.placing || !canCheckout"
              :class="[
                'w-full py-4 text-white rounded-xl transition-all shadow-lg shadow-green-200 dark:shadow-green-900/30 text-sm',
                canCheckout && !ordersStore.placing ? 'bg-green-600 hover:bg-green-700 active:scale-95' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              ]"
              :style="{ fontWeight: 700 }"
            >
              <span v-if="ordersStore.placing" class="flex items-center justify-center gap-2">
                <Loader2 class="w-4 h-4 animate-spin" /> Processing...
              </span>
              <span v-else>Proceed to Payment</span>
            </button>
            <router-link to="/menu" class="flex items-center justify-center gap-2 w-full mt-3 py-3 border border-gray-200 dark:border-[#263a32] text-gray-600 dark:text-[#7a9e8c] rounded-xl hover:border-green-200 dark:hover:border-green-700 hover:text-green-600 dark:hover:text-green-400 transition-all text-sm" :style="{ fontWeight: 600 }">
              <ArrowLeft class="w-4 h-4" />
              Continue Shopping
            </router-link>
            <div class="mt-5 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p class="text-xs text-green-700 dark:text-green-400" :style="{ fontWeight: 700 }">Estimated Delivery</p>
              <p class="text-green-900 dark:text-green-300 text-sm mt-0.5" :style="{ fontWeight: 600 }">25 - 35 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
