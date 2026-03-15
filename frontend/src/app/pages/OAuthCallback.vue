<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  const accessToken = route.query.accessToken as string
  const refreshToken = route.query.refreshToken as string

  if (accessToken && refreshToken) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    await auth.restoreSession()
    router.replace('/')
  } else {
    router.replace('/login?error=oauth_failed')
  }
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-20">
    <div class="text-center">
      <Loader2 class="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 text-sm">Signing you in...</p>
    </div>
  </main>
</template>
