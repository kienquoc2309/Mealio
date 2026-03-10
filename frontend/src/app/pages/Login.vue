<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const isLogin = ref(true)
const showPassword = ref(false)
const form = ref({ name: '', email: '', password: '' })
const error = ref('')
const submitted = ref(false)

watchEffect(() => {
  if (auth.currentUser && !auth.loading) {
    router.push('/')
  }
})

const handleSubmit = async () => {
  error.value = ''

  if (isLogin.value) {
    const result = await auth.login(form.value.email, form.value.password)
    if (result.success) {
      submitted.value = true
      setTimeout(() => router.push('/'), 800)
    } else {
      error.value = result.message
    }
  } else {
    if (form.value.password.length < 8) {
      error.value = 'Password must be at least 8 characters.'
      return
    }
    const result = await auth.register(form.value.name, form.value.email, form.value.password)
    if (result.success) {
      submitted.value = true
      setTimeout(() => router.push('/'), 800)
    } else {
      error.value = result.message
    }
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors mb-8 text-sm"
        :style="{ fontWeight: 500 }"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Home
      </router-link>

      <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-4">
            <UtensilsCrossed class="w-7 h-7 text-white" />
          </div>
          <h1 class="text-gray-900 dark:text-white text-2xl" :style="{ fontWeight: 800 }">
            {{ isLogin ? 'Welcome Back!' : 'Create Account' }}
          </h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ isLogin ? 'Sign in to your Mealio account' : 'Join Mealio for delicious food delivery' }}
          </p>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button class="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all text-sm text-gray-600 dark:text-gray-300" :style="{ fontWeight: 600 }">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button class="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all text-sm text-gray-600 dark:text-gray-300" :style="{ fontWeight: 600 }">
            <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span class="text-gray-400 text-xs" :style="{ fontWeight: 500 }">or continue with email</span>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <!-- Error -->
        <div v-if="error" class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl mb-5">
          <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0" />
          <p class="text-red-600 dark:text-red-400 text-xs" :style="{ fontWeight: 500 }">{{ error }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="!isLogin">
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Full Name</label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                v-model="form.name"
                placeholder="John Doe"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1.5" :style="{ fontWeight: 600 }">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                v-model="form.email"
                placeholder="you@example.com"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs text-gray-600 dark:text-gray-400" :style="{ fontWeight: 600 }">Password</label>
              <a v-if="isLogin" href="#" class="text-xs text-green-600 hover:text-green-700" :style="{ fontWeight: 500 }">Forgot password?</a>
            </div>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                required
                class="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 placeholder-gray-400 transition-all"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="auth.loading || submitted"
            :class="[
              'w-full py-3.5 rounded-xl text-white text-sm transition-all shadow-md',
              submitted ? 'bg-green-500 shadow-green-200' : auth.loading ? 'bg-green-400 shadow-green-200 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200 active:scale-95'
            ]"
            :style="{ fontWeight: 700 }"
          >
            {{ submitted ? '✓ Success! Redirecting...' : auth.loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <button
            @click="isLogin = !isLogin; error = ''"
            class="text-green-600 hover:text-green-700 transition-colors"
            :style="{ fontWeight: 700 }"
          >
            {{ isLogin ? 'Sign Up' : 'Sign In' }}
          </button>
        </p>
      </div>
    </div>
  </main>
</template>
