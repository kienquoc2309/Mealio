<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, Star, Plus, Check, SlidersHorizontal, Loader2 } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { foodService, type FoodItem, type FoodCategory } from '../services/foodService'
import { categories as fallbackCategories, dishes as fallbackDishes, type Dish } from '../data/menuData'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const activeCategory = ref<string>('all')
const sortBy = ref<string>('default')
const addedIds = ref<Set<string>>(new Set())
const loading = ref(true)

const foods = ref<FoodItem[]>([])
const categories = ref<FoodCategory[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const [foodsData, categoriesData] = await Promise.all([
      foodService.getAllFoods(),
      foodService.getAllCategories(),
    ])
    foods.value = foodsData
    categories.value = categoriesData
  } catch {
    // Fallback to static data if API is unavailable
    foods.value = []
    categories.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const useFallback = computed(() => foods.value.length === 0 && !loading.value)

const getCategoryName = (food: FoodItem): string => {
  if (typeof food.categoryId === 'object' && food.categoryId !== null) {
    return (food.categoryId as FoodCategory).name.toLowerCase()
  }
  return ''
}

const getCategoryIcon = (cat: FoodCategory): string => {
  return cat.icon || '🍽️'
}

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

// API dishes
const filteredApiFoods = computed(() => {
  let list = foods.value.filter(f => f.isAvailable !== false)
  if (activeCategory.value !== 'all') {
    list = list.filter(f => {
      if (typeof f.categoryId === 'object' && f.categoryId !== null) {
        return (f.categoryId as FoodCategory)._id === activeCategory.value ||
               (f.categoryId as FoodCategory).name.toLowerCase() === activeCategory.value
      }
      return false
    })
  }
  if (sortBy.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  return list
})

// Fallback static dishes
const filteredFallbackDishes = computed(() => {
  let list = activeCategory.value === 'all' ? fallbackDishes : fallbackDishes.filter((d) => d.category === activeCategory.value)
  if (sortBy.value === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  return list
})

const displayCount = computed(() => useFallback.value ? filteredFallbackDishes.value.length : filteredApiFoods.value.length)

const handleAddApi = (food: FoodItem) => {
  const dish: Dish = {
    id: food._id as unknown as number,
    name: food.name,
    description: food.description,
    price: food.price,
    image: food.image,
    category: getCategoryName(food),
    rating: food.rating,
    reviews: food.reviews,
    tag: food.tag,
  }
  // Store _id for cart operations
  ;(dish as any)._id = food._id
  cart.addToCart(dish)
  addedIds.value = new Set(addedIds.value).add(food._id)
  setTimeout(() => {
    const next = new Set(addedIds.value)
    next.delete(food._id)
    addedIds.value = next
  }, 1500)
}

const handleAddFallback = (dish: Dish) => {
  cart.addToCart(dish)
  addedIds.value = new Set(addedIds.value).add(String(dish.id))
  setTimeout(() => {
    const next = new Set(addedIds.value)
    next.delete(String(dish.id))
    addedIds.value = next
  }, 1500)
}

const isInCartApi = (id: string) => cart.cartItems.some((item) => (item as any)._id === id || String(item.id) === id)
const isInCartFallback = (id: number) => cart.cartItems.some((item) => item.id === id)

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
  <main class="min-h-screen bg-gray-50 dark:bg-[#0a1a0f] pt-20 lg:pt-20">
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
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Loader2 class="w-8 h-8 text-green-600 animate-spin" />
        <span class="ml-3 text-gray-500 dark:text-[#4d7a60]">Loading menu...</span>
      </div>

      <template v-else>
        <!-- Category Tabs -->
        <div class="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            @click="handleCategoryChange('all')"
            :class="[
              'flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all',
              activeCategory === 'all'
                ? 'bg-green-600 text-white shadow-md shadow-green-200 dark:shadow-none'
                : 'bg-white dark:bg-[#112318] text-gray-600 dark:text-[#7aad90] border border-gray-200 dark:border-[rgba(82,183,136,0.15)] hover:border-green-200 dark:hover:border-[rgba(82,183,136,0.3)] hover:text-green-600 dark:hover:text-[#52b788]'
            ]"
            :style="{ fontWeight: 600 }"
          >
            All Dishes
          </button>
          <!-- API categories -->
          <template v-if="!useFallback">
            <button
              v-for="cat in categories"
              :key="cat._id"
              @click="handleCategoryChange(cat.name.toLowerCase())"
              :class="[
                'flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all',
                activeCategory === cat.name.toLowerCase()
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-200 hover:text-green-600'
              ]"
              :style="{ fontWeight: 600 }"
            >
              {{ getCategoryIcon(cat) }} {{ cat.name }}
            </button>
          </template>
          <!-- Fallback categories -->
          <template v-else>
            <button
              v-for="cat in fallbackCategories"
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
          </template>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-500 dark:text-[#4d7a60] text-sm">
            Showing <span class="text-gray-900 dark:text-[#e8f5ee]" :style="{ fontWeight: 600 }">{{ displayCount }}</span> dishes
            <span v-if="activeCategory !== 'all'" class="text-green-600 dark:text-[#52b788]">
              in <span :style="{ fontWeight: 600 }" class="capitalize">{{ activeCategory }}</span>
            </span>
          </p>
          <div class="flex items-center gap-2">
            <SlidersHorizontal class="w-4 h-4 text-gray-400 dark:text-[#4d7a60]" />
            <select
              v-model="sortBy"
              class="text-sm border border-gray-200 dark:border-[rgba(82,183,136,0.15)] bg-white dark:bg-[#112318] text-gray-700 dark:text-[#7aad90] rounded-xl px-3 py-2 outline-none focus:border-green-400 cursor-pointer"
              :style="{ fontWeight: 500 }"
            >
              <option value="default">Sort: Default</option>
              <option value="rating">Sort: Top Rated</option>
              <option value="price-asc">Sort: Price Low-High</option>
              <option value="price-desc">Sort: Price High-Low</option>
            </select>
          </div>
        </div>

        <!-- API Foods Grid -->
        <template v-if="!useFallback">
          <div v-if="filteredApiFoods.length === 0" class="text-center py-20">
            <p class="text-gray-400 dark:text-[#4d7a60] text-lg">No dishes found in this category.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="food in filteredApiFoods"
              :key="food._id"
              class="bg-white dark:bg-[#112318] rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-[rgba(82,183,136,0.15)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div class="relative h-48 overflow-hidden flex-shrink-0">
                <img :src="food.image" :alt="food.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span
                  v-if="food.tag && tagColors[food.tag]"
                  :class="['absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs', tagColors[food.tag]]"
                  :style="{ fontWeight: 700 }"
                >
                  {{ food.tag }}
                </span>
                <button
                  @click="handleAddApi(food)"
                  :class="[
                    'absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl shadow-md transition-all',
                    addedIds.has(food._id)
                      ? 'bg-green-500 text-white scale-110'
                      : 'bg-white text-green-600 hover:bg-green-600 hover:text-white'
                  ]"
                >
                  <Check v-if="addedIds.has(food._id)" class="w-4 h-4" />
                  <Plus v-else class="w-4 h-4" />
                </button>
              </div>

              <div class="p-4 flex flex-col flex-1">
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <h3 class="text-gray-900 dark:text-[#e8f5ee] text-sm flex-1 min-w-0" :style="{ fontWeight: 700 }">{{ food.name }}</h3>
                  <span class="text-green-600 text-base flex-shrink-0" :style="{ fontWeight: 800 }">{{ new Intl.NumberFormat('vi-VN').format(food.price)}}₫</span>
                </div>
                <p class="text-gray-400 dark:text-[#4d7a60] text-xs leading-relaxed mb-3 flex-1">{{ food.description }}</p>
                <div class="flex items-center justify-between mt-auto">
                  <div class="flex items-center gap-1">
                    <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span class="text-gray-700 dark:text-[#7aad90] text-xs" :style="{ fontWeight: 600 }">{{ food.rating }}</span>
                    <span class="text-gray-400 dark:text-[#4d7a60] text-xs">({{food.reviews }})</span>
                  </div>
                  <button
                    @click="handleAddApi(food)"
                    :class="[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95',
                      addedIds.has(food._id)
                        ? 'bg-green-100 text-green-600'
                        : isInCartApi(food._id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                    ]"
                    :style="{ fontWeight: 600 }"
                  >
                    <template v-if="addedIds.has(food._id)">
                      <Check class="w-3 h-3" /> Added!
                    </template>
                    <template v-else-if="isInCartApi(food._id)">
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
        </template>

        <!-- Fallback Static Dishes Grid -->
        <template v-else>
          <div v-if="filteredFallbackDishes.length === 0" class="text-center py-20">
            <p class="text-gray-400 dark:text-[#4d7a60] text-lg">No dishes found in this category.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="dish in filteredFallbackDishes"
              :key="dish.id"
              class="bg-white dark:bg-[#112318] rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-[rgba(82,183,136,0.15)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
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
                  @click="handleAddFallback(dish)"
                  :class="[
                    'absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-xl shadow-md transition-all',
                    addedIds.has(String(dish.id))
                      ? 'bg-green-500 text-white scale-110'
                      : 'bg-white text-green-600 hover:bg-green-600 hover:text-white'
                  ]"
                >
                  <Check v-if="addedIds.has(String(dish.id))" class="w-4 h-4" />
                  <Plus v-else class="w-4 h-4" />
                </button>
              </div>

              <div class="p-4 flex flex-col flex-1">
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <h3 class="text-gray-900 dark:text-[#e8f5ee] text-sm flex-1 min-w-0" :style="{ fontWeight: 700 }">{{ dish.name }}</h3>
                  <span class="text-green-600 text-base flex-shrink-0" :style="{ fontWeight: 800 }">${{ dish.price.toFixed(2) }}</span>
                </div>
                <p class="text-gray-400 dark:text-[#4d7a60] text-xs leading-relaxed mb-3 flex-1">{{ dish.description }}</p>
                <div class="flex items-center justify-between mt-auto">
                  <div class="flex items-center gap-1">
                    <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span class="text-gray-700 dark:text-[#7aad90] text-xs" :style="{ fontWeight: 600 }">{{ dish.rating }}</span>
                    <span class="text-gray-400 dark:text-[#4d7a60] text-xs">({{dish.reviews }})</span>
                  </div>
                  <button
                    @click="handleAddFallback(dish)"
                    :class="[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95',
                      addedIds.has(String(dish.id))
                        ? 'bg-green-100 text-green-600'
                        : isInCartFallback(dish.id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                    ]"
                    :style="{ fontWeight: 600 }"
                  >
                    <template v-if="addedIds.has(String(dish.id))">
                      <Check class="w-3 h-3" /> Added!
                    </template>
                    <template v-else-if="isInCartFallback(dish.id)">
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
        </template>
      </template>
    </div>
  </main>
</template>
