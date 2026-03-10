<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, Star, Plus, Check, SlidersHorizontal } from 'lucide-vue-next'
import { categories, dishes, type Dish } from '../data/menuData'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const activeCategory = ref<string>('all')
const sortBy = ref<string>('default')
const addedIds = ref<Set<number>>(new Set())

watch(
  () => route.query.category,
  (cat) => {
    if (cat && typeof cat === 'string') {
      activeCategory.value = cat
    }
  },
  { immediate: true }
)

const handleCategoryChange = (catId: string) => {
  activeCategory.value = catId
  if (catId === 'all') {
    router.replace({ query: {} })
  } else {
    router.replace({ query: { category: catId } })
  }
}

const filteredDishes = computed(() => {
  let list = activeCategory.value === 'all' ? dishes : dishes.filter((d) => d.category === activeCategory.value)
  if (sortBy.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  return list
})

const handleAdd = (dish: Dish) => {
  cart.addToCart(dish)
  addedIds.value = new Set(addedIds.value).add(dish.id)
  setTimeout(() => {
    const next = new Set(addedIds.value)
    next.delete(dish.id)
    addedIds.value = next
  }, 1500)
}

const isInCart = (id: number) => cart.cartItems.some((item) => item.id === id)

const tagColors: Record<string, string> = {
  'Best Seller': 'bg-green-100 text-green-700',
  "Chef's Pick": 'bg-purple-100 text-purple-600',
  Popular: 'bg-blue-100 text-blue-600',
  Healthy: 'bg-teal-100 text-teal-600',
  Vegan: 'bg-emerald-100 text-emerald-600',
  Fresh: 'bg-cyan-100 text-cyan-600',
  Classic: 'bg-amber-100 text-amber-600',
  Premium: 'bg-rose-100 text-rose-600',
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 pt-20 lg:pt-24">
    <!-- Hero Banner -->
    <div
      class="py-14 px-4 relative overflow-hidden"
      :style="{ background: 'linear-gradient(135deg, #0d2818 0%, #1a3d2b 35%, #2D6A4F 65%, #1f4d38 100%)' }"
    >
      <div
        class="absolute top-[-60px] right-[-60px] rounded-full pointer-events-none"
        :style="{ width: '320px', height: '320px', background: 'radial-gradient(circle, #40916C44 0%, transparent 70%)' }"
      />
      <div
        class="absolute bottom-[-40px] left-[-40px] rounded-full pointer-events-none"
        :style="{ width: '240px', height: '240px', background: 'radial-gradient(circle, #74C69D33 0%, transparent 70%)' }"
      />
      <div class="absolute top-8 right-1/4 w-3 h-3 rounded-full opacity-30 pointer-events-none" :style="{ background: '#74C69D' }" />
      <div class="absolute bottom-10 left-1/3 w-4 h-4 rounded-full opacity-20 pointer-events-none" :style="{ background: '#B7E4C7' }" />
      <div class="relative z-10 max-w-7xl mx-auto text-center">
        <h1 class="text-white text-3xl sm:text-4xl mb-3" :style="{ fontWeight: 800 }">Our Menu</h1>
        <p class="text-base max-w-md mx-auto" :style="{ color: 'rgba(255,255,255,0.65)' }">
          Explore our handcrafted dishes made from the freshest ingredients
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Category Tabs -->
      <div class="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button
          @click="handleCategoryChange('all')"
          :class="[
            'flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all',
            activeCategory === 'all'
              ? 'bg-green-600 text-white shadow-md shadow-green-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-200 hover:text-green-600'
          ]"
          :style="{ fontWeight: 600 }"
        >
          🍽️ All Dishes
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="handleCategoryChange(cat.id)"
          :class="[
            'flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all',
            activeCategory === cat.id
              ? 'bg-green-600 text-white shadow-md shadow-green-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-200 hover:text-green-600'
          ]"
          :style="{ fontWeight: 600 }"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-500 text-sm">
          Showing <span class="text-gray-900" :style="{ fontWeight: 600 }">{{ filteredDishes.length }}</span> dishes
          <span v-if="activeCategory !== 'all'" class="text-green-600">
            in <span :style="{ fontWeight: 600 }" class="capitalize">{{ activeCategory }}</span>
          </span>
        </p>
        <div class="flex items-center gap-2">
          <SlidersHorizontal class="w-4 h-4 text-gray-400" />
          <select
            v-model="sortBy"
            class="text-sm border border-gray-200 bg-white text-gray-700 rounded-xl px-3 py-2 outline-none focus:border-green-400 cursor-pointer"
            :style="{ fontWeight: 500 }"
          >
            <option value="default">Sort: Default</option>
            <option value="rating">Sort: Top Rated</option>
            <option value="price-asc">Sort: Price Low-High</option>
            <option value="price-desc">Sort: Price High-Low</option>
          </select>
        </div>
      </div>

      <!-- Dishes Grid -->
      <div v-if="filteredDishes.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No dishes found in this category.</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- DishCard inline -->
        <div
          v-for="dish in filteredDishes"
          :key="dish.id"
          class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
        >
          <div class="relative h-48 overflow-hidden flex-shrink-0">
            <img :src="dish.image" :alt="dish.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span
              v-if="dish.tag && tagColors[dish.tag]"
              :class="['absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs', tagColors[dish.tag]]"
              :style="{ fontWeight: 700 }"
            >
              {{ dish.tag }}
            </span>
            <button
              @click="handleAdd(dish)"
              :class="[
                'absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl shadow-md transition-all',
                addedIds.has(dish.id)
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-white text-green-600 hover:bg-green-600 hover:text-white'
              ]"
            >
              <Check v-if="addedIds.has(dish.id)" class="w-4 h-4" />
              <Plus v-else class="w-4 h-4" />
            </button>
          </div>

          <div class="p-4 flex flex-col flex-1">
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <h3 class="text-gray-900 text-sm flex-1 min-w-0" :style="{ fontWeight: 700 }">{{ dish.name }}</h3>
              <span class="text-green-600 text-base flex-shrink-0" :style="{ fontWeight: 800 }">${{ dish.price.toFixed(2) }}</span>
            </div>
            <p class="text-gray-400 text-xs leading-relaxed mb-3 flex-1">{{ dish.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <div class="flex items-center gap-1">
                <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span class="text-gray-700 text-xs" :style="{ fontWeight: 600 }">{{ dish.rating }}</span>
                <span class="text-gray-400 text-xs">({{ dish.reviews }})</span>
              </div>
              <button
                @click="handleAdd(dish)"
                :class="[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95',
                  addedIds.has(dish.id)
                    ? 'bg-green-100 text-green-600'
                    : isInCart(dish.id)
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                ]"
                :style="{ fontWeight: 600 }"
              >
                <template v-if="addedIds.has(dish.id)">
                  <Check class="w-3 h-3" /> Added!
                </template>
                <template v-else-if="isInCart(dish.id)">
                  <ShoppingCart class="w-3 h-3" /> Add More
                </template>
                <template v-else>
                  <ShoppingCart class="w-3 h-3" /> Add to Cart
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
