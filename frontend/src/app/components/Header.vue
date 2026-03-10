<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ShoppingCart, Search, User, Menu, X,
  Sun, Moon, LogOut, Package, Settings, Shield, ChevronDown,
} from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { dishes } from '../data/menuData'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<typeof dishes>([])
const dropdownOpen = ref(false)
let hoverTimeout: ReturnType<typeof setTimeout> | null = null

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Mobile App', path: '/mobile-app' },
  { label: 'Contact Us', path: '/contact' },
]

const isActive = (path: string) => route.path === path

const handleSearch = (query: string) => {
  searchQuery.value = query
  if (query.trim().length === 0) { searchResults.value = []; return }
  const results = dishes.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.category.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
  )
  searchResults.value = results.slice(0, 5)
}

const handleSearchSelect = (category: string) => {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  router.push(`/menu?category=${category}`)
}

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const handleMouseEnter = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout)
  dropdownOpen.value = true
}

const handleMouseLeave = () => {
  hoverTimeout = setTimeout(() => { dropdownOpen.value = false }, 200)
}

const handleLogout = async () => {
  dropdownOpen.value = false
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-green-100 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <router-link to="/" class="flex items-center group">
          <img
            src="/mealio-horizontal.svg"
            alt="Mealio"
            class="h-10 dark:hidden"
          />
          <img
            src="/mealio-horizontal-dark.svg"
            alt="Mealio"
            class="h-10 hidden dark:block"
          />
        </router-link>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-8">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'text-sm transition-colors relative group',
              isActive(link.path)
                ? 'text-green-600'
                : 'text-gray-600 dark:text-gray-300 hover:text-green-600'
            ]"
            :style="{ fontWeight: 500 }"
          >
            {{ link.label }}
            <span
              :class="[
                'absolute -bottom-1 left-0 h-0.5 bg-green-600 transition-all duration-300',
                isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
              ]"
            />
          </router-link>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Search -->
          <button
            @click="searchOpen = true"
            class="p-2.5 text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
            title="Search dishes"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- Cart -->
          <router-link
            to="/cart"
            class="relative p-2.5 text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
            title="Cart"
          >
            <ShoppingCart class="w-5 h-5" />
            <span
              v-if="cart.totalItems > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-green-600 text-white text-[10px] rounded-full flex items-center justify-center"
              :style="{ fontWeight: 700 }"
            >
              {{ cart.totalItems > 9 ? '9+' : cart.totalItems }}
            </span>
          </router-link>

          <!-- USER AVATAR DROPDOWN (logged in) or LOGIN BUTTON -->
          <template v-if="auth.currentUser">
            <div
              class="relative hidden sm:block"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <button
                class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                @click="dropdownOpen = !dropdownOpen"
              >
                <div
                  :class="['w-8 h-8', auth.currentUser.avatarColor, 'rounded-lg flex items-center justify-center flex-shrink-0']"
                >
                  <span class="text-white text-xs" :style="{ fontWeight: 800 }">
                    {{ auth.currentUser.initials }}
                  </span>
                </div>
                <span class="text-gray-700 dark:text-gray-200 text-sm max-w-[96px] truncate" :style="{ fontWeight: 600 }">
                  {{ auth.currentUser.name.split(' ')[0] }}
                </span>
                <ChevronDown
                  :class="['w-3.5 h-3.5 text-gray-400 transition-transform', dropdownOpen ? 'rotate-180' : '']"
                />
              </button>

              <!-- Dropdown -->
              <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <div class="flex items-center gap-3">
                    <div :class="['w-10 h-10', auth.currentUser.avatarColor, 'rounded-xl flex items-center justify-center flex-shrink-0']">
                      <span class="text-white text-sm" :style="{ fontWeight: 800 }">{{ auth.currentUser.initials }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-gray-900 dark:text-white text-sm truncate" :style="{ fontWeight: 700 }">
                        {{ auth.currentUser.name }}
                      </p>
                      <p class="text-gray-400 dark:text-gray-500 text-xs truncate">{{ auth.currentUser.email }}</p>
                    </div>
                  </div>
                  <span
                    v-if="auth.currentUser.role === 'admin'"
                    class="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[11px] rounded-full"
                    :style="{ fontWeight: 600 }"
                  >
                    <Shield class="w-3 h-3" /> Administrator
                  </span>
                </div>

                <div class="p-2">
                  <router-link
                    to="/profile"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    :style="{ fontWeight: 500 }"
                  >
                    <Settings class="w-4 h-4" />
                    Get Profile
                  </router-link>

                  <button
                    @click="auth.toggleTheme()"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    :style="{ fontWeight: 500 }"
                  >
                    <template v-if="auth.theme === 'light'">
                      <Moon class="w-4 h-4" />
                      <span>Theme</span>
                      <span class="ml-auto text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">Light</span>
                    </template>
                    <template v-else>
                      <Sun class="w-4 h-4" />
                      <span>Theme</span>
                      <span class="ml-auto text-xs px-2 py-0.5 bg-gray-700 text-yellow-300 rounded-full">Dark</span>
                    </template>
                  </button>

                  <router-link
                    to="/my-orders"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                    :style="{ fontWeight: 500 }"
                  >
                    <Package class="w-4 h-4" />
                    Orders
                  </router-link>

                  <router-link
                    v-if="auth.currentUser.role === 'admin'"
                    to="/admin"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    :style="{ fontWeight: 600 }"
                  >
                    <Shield class="w-4 h-4" />
                    Admin Panel
                  </router-link>

                  <div class="border-t border-gray-100 dark:border-gray-800 my-2" />

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    :style="{ fontWeight: 500 }"
                  >
                    <LogOut class="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-sm"
              :style="{ fontWeight: 600 }"
            >
              <User class="w-4 h-4" />
              Login
            </router-link>
          </template>

          <!-- Mobile menu toggle -->
          <button
            class="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
            @click="mobileOpen = !mobileOpen"
          >
            <X v-if="mobileOpen" class="w-5 h-5" />
            <Menu v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div v-if="mobileOpen" class="lg:hidden border-t border-green-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-1">
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        @click="mobileOpen = false"
        :class="[
          'block px-4 py-3 rounded-xl text-sm transition-colors',
          isActive(link.path)
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600'
            : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600'
        ]"
        :style="{ fontWeight: 500 }"
      >
        {{ link.label }}
      </router-link>

      <template v-if="auth.currentUser">
        <div class="flex items-center gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800 mt-2 pt-3">
          <div :class="['w-9 h-9', auth.currentUser.avatarColor, 'rounded-xl flex items-center justify-center flex-shrink-0']">
            <span class="text-white text-sm" :style="{ fontWeight: 700 }">{{ auth.currentUser.initials }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-gray-900 dark:text-white text-sm truncate" :style="{ fontWeight: 700 }">{{ auth.currentUser.name }}</p>
            <p class="text-gray-400 text-xs truncate">{{ auth.currentUser.email }}</p>
          </div>
        </div>
        <router-link to="/profile" @click="mobileOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors" :style="{ fontWeight: 500 }">
          <Settings class="w-4 h-4" /> Get Profile
        </router-link>
        <button @click="auth.toggleTheme(); mobileOpen = false" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors" :style="{ fontWeight: 500 }">
          <Moon v-if="auth.theme === 'light'" class="w-4 h-4" />
          <Sun v-else class="w-4 h-4" />
          Theme ({{ auth.theme }})
        </button>
        <router-link to="/my-orders" @click="mobileOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors" :style="{ fontWeight: 500 }">
          <Package class="w-4 h-4" /> Orders
        </router-link>
        <router-link v-if="auth.currentUser.role === 'admin'" to="/admin" @click="mobileOpen = false" class="flex items-center gap-2 px-4 py-2.5 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors" :style="{ fontWeight: 600 }">
          <Shield class="w-4 h-4" /> Admin Panel
        </router-link>
        <button @click="handleLogout(); mobileOpen = false" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" :style="{ fontWeight: 500 }">
          <LogOut class="w-4 h-4" /> Sign Out
        </button>
      </template>
      <template v-else>
        <router-link
          to="/login"
          @click="mobileOpen = false"
          class="flex items-center gap-2 px-4 py-3 bg-green-600 text-white text-sm rounded-xl mt-2"
          :style="{ fontWeight: 600 }"
        >
          <User class="w-4 h-4" />
          Login
        </router-link>
      </template>
    </div>
  </header>

  <!-- Search Modal -->
  <div
    v-if="searchOpen"
    class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
    @click.self="closeSearch"
  >
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
      <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <Search class="w-5 h-5 text-green-600 flex-shrink-0" />
        <input
          autofocus
          type="text"
          :value="searchQuery"
          @input="handleSearch(($event.target as HTMLInputElement).value)"
          placeholder="Search dishes, categories..."
          class="flex-1 outline-none text-gray-800 dark:text-white dark:bg-gray-900 placeholder-gray-400 text-sm"
        />
        <button
          @click="closeSearch"
          class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X class="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <ul v-if="searchResults.length > 0" class="py-2 max-h-80 overflow-y-auto">
        <li v-for="dish in searchResults" :key="dish.id">
          <button
            @click="handleSearchSelect(dish.category)"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
          >
            <img :src="dish.image" :alt="dish.name" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            <div class="min-w-0">
              <p class="text-sm text-gray-900 dark:text-white truncate" :style="{ fontWeight: 500 }">{{ dish.name }}</p>
              <p class="text-xs text-green-600 capitalize">{{ dish.category }}</p>
            </div>
            <span class="ml-auto text-sm text-gray-700 dark:text-gray-300" :style="{ fontWeight: 600 }">${{ dish.price }}</span>
          </button>
        </li>
      </ul>
      <div v-else-if="searchQuery.length > 0" class="py-8 text-center text-gray-400 text-sm">
        No dishes found for "{{ searchQuery }}"
      </div>
      <div v-else class="py-6 px-4">
        <p class="text-xs text-gray-400 mb-3" :style="{ fontWeight: 600 }">POPULAR SEARCHES</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in ['Pasta', 'Burger', 'Pizza', 'Sushi', 'Salad', 'Dessert']"
            :key="tag"
            @click="handleSearchSelect(tag.toLowerCase())"
            class="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            :style="{ fontWeight: 500 }"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
