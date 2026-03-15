<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, CheckCircle, XCircle } from 'lucide-vue-next'
import { authService } from '../services/authService'

const route = useRoute()

const status = ref<'verifying' | 'success' | 'error'>('verifying')
const message = ref('')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    status.value = 'error'
    message.value = 'Invalid verification link'
    return
  }

  try {
    const res = await authService.verifyEmail(token)
    if (res.success) {
      status.value = 'success'
      message.value = res.message
    } else {
      status.value = 'error'
      message.value = res.message
    }
  } catch (err: any) {
    status.value = 'error'
    message.value = err.response?.data?.message || 'Verification failed'
  }
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700 text-center">
        <!-- Verifying -->
        <template v-if="status === 'verifying'">
          <Loader2 class="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <h1 class="text-xl text-gray-900 dark:text-white mb-2" :style="{ fontWeight: 700 }">Verifying your email...</h1>
          <p class="text-gray-400 text-sm">Please wait a moment</p>
        </template>

        <!-- Success -->
        <template v-else-if="status === 'success'">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <h1 class="text-xl text-gray-900 dark:text-white mb-2" :style="{ fontWeight: 700 }">Email Verified!</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">{{ message }}</p>
          <router-link
            to="/"
            class="inline-block w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm text-center transition-all shadow-md shadow-green-200 active:scale-95"
            :style="{ fontWeight: 700 }"
          >
            Go to Home
          </router-link>
        </template>

        <!-- Error -->
        <template v-else>
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle class="w-8 h-8 text-red-500" />
          </div>
          <h1 class="text-xl text-gray-900 dark:text-white mb-2" :style="{ fontWeight: 700 }">Verification Failed</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">{{ message }}</p>
          <router-link
            to="/login"
            class="inline-block w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm text-center transition-all shadow-md shadow-green-200 active:scale-95"
            :style="{ fontWeight: 700 }"
          >
            Back to Login
          </router-link>
        </template>
      </div>
    </div>
  </main>
</template>
