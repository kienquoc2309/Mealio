<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()

const showFooter = computed(() => route.path !== '/login')
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div
    id="app-root"
    :class="['min-h-screen flex flex-col', auth.theme === 'dark' ? 'dark' : '']"
  >
    <Header v-if="!isAdmin" />
    <div class="flex-1 bg-background text-foreground">
      <router-view />
    </div>
    <Footer v-if="showFooter && !isAdmin" />
  </div>
</template>

<script lang="ts">
export default {}
</script>
