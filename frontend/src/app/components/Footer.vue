<script setup lang="ts">
import { Instagram, Twitter, Facebook, MapPin, Phone, Mail } from 'lucide-vue-next'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Mobile App', path: '/mobile-app' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Login', path: '/login' },
]

const categories = ['Pasta', 'Salad', 'Burger', 'Pizza', 'Sushi', 'Dessert']
</script>

<template>
  <footer class="bg-[#0d2818] dark:bg-[#050e08] text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="mb-4">
            <img src="/mealio-horizontal-dark.svg" alt="Mealio" class="h-10" />
          </div>
          <p class="text-sm text-gray-400 leading-relaxed mb-5">
            Delivering happiness to your doorstep. Fresh, delicious meals from our kitchen to yours — fast and always on time.
          </p>
          <div class="flex items-center gap-3">
            <a href="#" class="w-9 h-9 bg-[#1a3d2b] dark:bg-[#0a1a0f] hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
              <Instagram class="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a href="#" class="w-9 h-9 bg-[#1a3d2b] dark:bg-[#0a1a0f] hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
              <Twitter class="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a href="#" class="w-9 h-9 bg-[#1a3d2b] dark:bg-[#0a1a0f] hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
              <Facebook class="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white dark:text-[#e8f5ee] text-sm mb-5" :style="{ fontWeight: 700 }">Quick Links</h4>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link
                :to="link.path"
                class="text-sm text-[rgba(255,255,255,0.6)] dark:text-[rgba(255,255,255,0.45)] hover:text-green-400 transition-colors"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h4 class="text-white dark:text-[#e8f5ee] text-sm mb-5" :style="{ fontWeight: 700 }">Categories</h4>
          <ul class="space-y-3">
            <li v-for="cat in categories" :key="cat">
              <router-link
                :to="`/menu?category=${cat.toLowerCase()}`"
                class="text-sm text-[rgba(255,255,255,0.6)] dark:text-[rgba(255,255,255,0.45)] hover:text-green-400 transition-colors"
              >
                {{ cat }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-white dark:text-[#e8f5ee] text-sm mb-5" :style="{ fontWeight: 700 }">Contact Us</h4>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <MapPin class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-gray-400">123 Flavor Street, Food City, FC 10001</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone class="w-4 h-4 text-green-500 flex-shrink-0" />
              <span class="text-sm text-gray-400">+1 (555) 123-4567</span>
            </li>
            <li class="flex items-center gap-3">
              <Mail class="w-4 h-4 text-green-500 flex-shrink-0" />
              <span class="text-sm text-gray-400">hello@mealio.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-[rgba(255,255,255,0.1)] dark:border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-500">
          &copy; 2026 Mealio. All rights reserved.
        </p>
        <div class="flex gap-4">
          <a href="#" class="text-xs text-gray-500 hover:text-green-400 transition-colors">Privacy Policy</a>
          <a href="#" class="text-xs text-gray-500 hover:text-green-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>
