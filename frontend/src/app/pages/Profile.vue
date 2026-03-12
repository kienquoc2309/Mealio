<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, User, Mail, Phone, MapPin, Save, CheckCircle, AlertCircle, Shield, Calendar } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const form = ref({
  name: auth.currentUser?.name ?? '',
  email: auth.currentUser?.email ?? '',
  phone: auth.currentUser?.phone ? formatPhone(auth.currentUser.phone) : '',
  address: auth.currentUser?.address ?? '',
})

const saved = ref(false)
const error = ref('')
const saving = ref(false)
const phoneError = ref('')

function formatPhone(raw: string): string {
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
  const digits = form.value.phone.replace(/\D/g, '')
  if (!digits) { phoneError.value = ''; return true }
  const isValid = /^(0[3-9]\d{8}|84[3-9]\d{8}|[3-9]\d{8})$/.test(digits)
  if (!isValid) {
    phoneError.value = 'Please enter a valid Vietnamese phone number'
    return false
  }
  phoneError.value = ''
  form.value.phone = formatPhone(digits)
  return true
}

const onPhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  input.value = input.value.replace(/[^\d\s+\-()]/g, '')
  form.value.phone = input.value
}

const handleSubmit = async () => {
  error.value = ''
  if (!validatePhone()) return
  saving.value = true
  const result = await auth.updateProfile({
    name: form.value.name,
    phone: form.value.phone,
    address: form.value.address,
  })
  saving.value = false
  if (result.success) {
    saved.value = true
    setTimeout(() => { saved.value = false }, 2500)
  } else {
    error.value = result.message
  }
}

const resetForm = () => {
  if (!auth.currentUser) return
  form.value = {
    name: auth.currentUser.name,
    email: auth.currentUser.email,
    phone: auth.currentUser.phone ? formatPhone(auth.currentUser.phone) : '',
    address: auth.currentUser.address,
  }
  phoneError.value = ''
}

const joinDate = computed(() => {
  if (!auth.currentUser) return ''
  return new Date(auth.currentUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<template>
  <main v-if="auth.currentUser" class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/" class="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:text-green-600 hover:border-green-200 transition-all">
          <ArrowLeft class="w-5 h-5" />
        </router-link>
        <div>
          <h1 class="text-gray-900 dark:text-white text-2xl" :style="{ fontWeight: 800 }">My Profile</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Manage your account information</p>
        </div>
      </div>

      <div class="grid gap-6">
        <!-- Avatar & Info Card -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div class="flex items-center gap-5">
            <div :class="['w-20 h-20', auth.currentUser.avatarColor, 'rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg']">
              <span class="text-white text-2xl" :style="{ fontWeight: 800 }">{{ auth.currentUser.initials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-gray-900 dark:text-white text-xl truncate" :style="{ fontWeight: 700 }">{{ auth.currentUser.name }}</h2>
              <p class="text-gray-500 dark:text-gray-400 text-sm truncate">{{ auth.currentUser.email }}</p>
              <div class="flex items-center gap-3 mt-2 flex-wrap">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs',
                    auth.currentUser.role === 'admin'
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                      : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                  ]"
                  :style="{ fontWeight: 600 }"
                >
                  <Shield class="w-3 h-3" />
                  {{ auth.currentUser.role === 'admin' ? 'Administrator' : 'Customer' }}
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar class="w-3 h-3" />
                  Joined {{ joinDate }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 class="text-gray-900 dark:text-white text-base mb-6" :style="{ fontWeight: 700 }">Edit Information</h3>

          <div v-if="saved" class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl mb-6">
            <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0" />
            <p class="text-green-700 dark:text-green-300 text-sm" :style="{ fontWeight: 600 }">Profile updated successfully!</p>
          </div>

          <div v-if="error" class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl mb-6">
            <AlertCircle class="w-5 h-5 text-red-500 flex-shrink-0" />
            <p class="text-red-600 dark:text-red-400 text-sm" :style="{ fontWeight: 600 }">{{ error }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Full Name</label>
                <div class="relative">
                  <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" v-model="form.name" required class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Email Address</label>
                <div class="relative">
                  <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" v-model="form.email" required class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all" />
                </div>
              </div>
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Phone Number</label>
                <div class="relative">
                  <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    v-model="form.phone"
                    @input="onPhoneInput"
                    @blur="validatePhone"
                    placeholder="e.g. 0788 808 474"
                    :class="[
                      'w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition-all dark:bg-gray-800 dark:text-white',
                      phoneError
                        ? 'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
                        : 'border-gray-200 dark:border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30'
                    ]"
                  />
                </div>
                <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
              </div>
              <div>
                <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Delivery Address</label>
                <div class="relative">
                  <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" v-model="form.address" class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all" />
                </div>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="saving" :class="['flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all shadow-sm text-sm', saving ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95']" :style="{ fontWeight: 700 }">
                <Save class="w-4 h-4" />
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
              <button type="button" @click="resetForm" class="px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm" :style="{ fontWeight: 600 }">
                Reset
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Links -->
        <div class="grid sm:grid-cols-2 gap-4">
          <router-link to="/my-orders" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-green-200 dark:hover:border-green-700 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/40 group-hover:bg-green-600 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <span class="text-lg group-hover:grayscale-0">📦</span>
            </div>
            <p class="text-gray-900 dark:text-white text-sm" :style="{ fontWeight: 700 }">My Orders</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-0.5">View your order history & status</p>
          </router-link>
          <router-link to="/menu" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-green-200 dark:hover:border-green-700 hover:shadow-md transition-all group">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/40 group-hover:bg-green-600 rounded-xl flex items-center justify-center mb-3 transition-colors">
              <span class="text-lg">🍽️</span>
            </div>
            <p class="text-gray-900 dark:text-white text-sm" :style="{ fontWeight: 700 }">Browse Menu</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Explore our delicious dishes</p>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>
