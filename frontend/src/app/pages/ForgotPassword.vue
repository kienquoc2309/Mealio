<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { authService } from '../services/authService'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await authService.forgotPassword(email.value)
    if (res.success) {
      success.value = true
    } else {
      error.value = res.message
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <router-link
        to="/login"
        class="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-8 text-sm"
        :style="{ fontWeight: 500 }"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Login
      </router-link>

      <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-4">
            <Mail class="w-7 h-7 text-white" />
          </div>
          <h1 class="text-gray-900 dark:text-white text-2xl" :style="{ fontWeight: 800 }">
            Forgot Password
          </h1>
          <p class="text-gray-400 text-sm mt-1 text-center">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <!-- Success State -->
        <div v-if="success" class="text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <h2 class="text-lg text-gray-900 dark:text-white mb-2" :style="{ fontWeight: 700 }">Check your email</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">
            If an account exists with {{ email }}, you'll receive a password reset link shortly.
          </p>
          <router-link
            to="/login"
            class="inline-block w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm text-center transition-all shadow-md shadow-green-200 active:scale-95"
            :style="{ fontWeight: 700 }"
          >
            Back to Login
          </router-link>
        </div>

        <!-- Form -->
        <template v-else>
          <div v-if="error" class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl mb-5">
            <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0" />
            <p class="text-red-600 dark:text-red-400 text-xs" :style="{ fontWeight: 500 }">{{ error }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  v-model="email"
                  placeholder="you@example.com"
                  required
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading"
              :class="[
                'w-full py-3.5 rounded-xl text-white text-sm transition-all shadow-md shadow-green-200',
                loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'
              ]"
              :style="{ fontWeight: 700 }"
            >
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        </template>
      </div>
    </div>
  </main>
</template>
