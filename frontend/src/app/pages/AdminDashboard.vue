<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  UtensilsCrossed, Users, ShoppingBag, TrendingUp, Plus, Pencil, Trash2,
  X, Check, ChevronDown, LayoutDashboard, LogOut, Search, Star, Loader2,
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import type { OrderStatus } from '../data/mockOrders'
import { authService, type UserProfile } from '../services/authService'
import { foodService, type FoodItem, type FoodCategory } from '../services/foodService'

type Tab = 'dashboard' | 'food' | 'users' | 'orders'

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Preparing', 'On the Way', 'Delivered', 'Cancelled']

const statusColor: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Preparing: 'bg-blue-100 text-blue-700',
  'On the Way': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
}

const auth = useAuthStore()
const router = useRouter()

const activeTab = ref<Tab>('dashboard')
const dishSearch = ref('')
const orderSearch = ref('')
const showDishForm = ref(false)
const sidebarOpen = ref(false)

// Food management
const foods = ref<FoodItem[]>([])
const categories = ref<FoodCategory[]>([])
const foodsLoading = ref(false)
const foodActionLoading = ref(false)
const foodMessage = ref<{ text: string; type: 'success' | 'error' } | null>(null)
let foodMessageTimer: ReturnType<typeof setTimeout> | null = null
const setFoodMessage = (msg: { text: string; type: 'success' | 'error' }) => {
  foodMessage.value = msg
  if (foodMessageTimer) clearTimeout(foodMessageTimer)
  foodMessageTimer = setTimeout(() => { foodMessage.value = null }, 4000)
}
const editingFood = ref<FoodItem | null>(null)
const showDeleteFoodModal = ref(false)
const deleteFoodId = ref<string | null>(null)
const deleteFoodName = ref('')
const tagOptions = ['Best Seller', "Chef's Pick", 'Popular', 'Healthy', 'Vegan', 'Fresh', 'Classic', 'Premium']

const emptyDishForm = {
  name: '', description: '', price: 0, image: '', categoryId: '', rating: 4.5, reviews: 0, tag: '' as string | undefined,
}
const dishForm = ref({ ...emptyDishForm })

// Users management
const users = ref<UserProfile[]>([])
const userSearch = ref('')
const usersLoading = ref(false)
const userActionLoading = ref(false)
const userMessage = ref<{ text: string; type: 'success' | 'error' } | null>(null)
const showDeleteModal = ref(false)
const deleteUserId = ref<string | null>(null)
const deleteUserName = ref('')
const showPasswordModal = ref(false)
const passwordUserId = ref<string | null>(null)
const passwordUserName = ref('')
const newPassword = ref('')

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500',
  'bg-green-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
]

function getUserAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getUserInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].substring(0, 2).toUpperCase()
}

const filteredUsers = computed(() => users.value.filter(u =>
  u.name.toLowerCase().includes(userSearch.value.toLowerCase()) ||
  u.email.toLowerCase().includes(userSearch.value.toLowerCase())
))

// Fetch foods and categories
const fetchFoods = async () => {
  foodsLoading.value = true
  try {
    const [foodsData, categoriesData] = await Promise.all([
      foodService.getAllFoods(),
      foodService.getAllCategories(),
    ])
    foods.value = foodsData
    categories.value = categoriesData
  } catch {
    setFoodMessage({ text: 'Failed to load foods', type: 'error' })
  } finally {
    foodsLoading.value = false
  }
}

const fetchUsers = async () => {
  usersLoading.value = true
  try {
    users.value = await authService.getAllUsers()
  } catch {
    userMessage.value = { text: 'Failed to load users', type: 'error' }
  } finally {
    usersLoading.value = false
  }
}

onMounted(() => {
  fetchFoods()
})

watch(activeTab, (tab) => {
  if (tab === 'users' && users.value.length === 0) fetchUsers()
}, { immediate: true })

const changeRole = async (userId: string, newRole: string) => {
  userActionLoading.value = true
  try {
    const updated = await authService.adminUpdateUser(userId, { role: newRole })
    const idx = users.value.findIndex(u => u._id === userId)
    if (idx !== -1) users.value[idx] = updated
    userMessage.value = { text: 'Role updated successfully', type: 'success' }
  } catch (err: any) {
    userMessage.value = { text: err.response?.data?.message || 'Failed to update role', type: 'error' }
  } finally {
    userActionLoading.value = false
  }
}

const openDeleteModal = (user: UserProfile) => {
  deleteUserId.value = user._id
  deleteUserName.value = user.name
  showDeleteModal.value = true
}

const confirmDeleteUser = async () => {
  if (!deleteUserId.value) return
  userActionLoading.value = true
  try {
    await authService.deleteUser(deleteUserId.value)
    users.value = users.value.filter(u => u._id !== deleteUserId.value)
    showDeleteModal.value = false
    userMessage.value = { text: 'User deleted successfully', type: 'success' }
  } catch (err: any) {
    userMessage.value = { text: err.response?.data?.message || 'Failed to delete user', type: 'error' }
  } finally {
    userActionLoading.value = false
  }
}

const openPasswordModal = (user: UserProfile) => {
  passwordUserId.value = user._id
  passwordUserName.value = user.name
  newPassword.value = ''
  showPasswordModal.value = true
}

const savePassword = async () => {
  if (!passwordUserId.value || !newPassword.value) return
  userActionLoading.value = true
  try {
    await authService.adminUpdateUser(passwordUserId.value, { password: newPassword.value })
    showPasswordModal.value = false
    userMessage.value = { text: 'Password updated successfully', type: 'success' }
  } catch (err: any) {
    userMessage.value = { text: err.response?.data?.message || 'Failed to update password', type: 'error' }
  } finally {
    userActionLoading.value = false
  }
}

const totalRevenue = computed(() => auth.orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0))
const pendingOrders = computed(() => auth.orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length)

const handleLogout = async () => { await auth.logout(); router.push('/') }

// Food CRUD
const getCategoryName = (food: FoodItem): string => {
  if (typeof food.categoryId === 'object' && food.categoryId !== null) {
    return (food.categoryId as FoodCategory).name
  }
  return ''
}

const getCategoryId = (food: FoodItem): string => {
  if (typeof food.categoryId === 'object' && food.categoryId !== null) {
    return (food.categoryId as FoodCategory)._id
  }
  return food.categoryId as string
}

const openAddDish = () => {
  editingFood.value = null
  dishForm.value = { ...emptyDishForm, categoryId: categories.value[0]?._id || '' }
  showDishForm.value = true
}

const openEditDish = (food: FoodItem) => {
  editingFood.value = food
  dishForm.value = {
    name: food.name,
    description: food.description,
    price: food.price,
    image: food.image,
    categoryId: getCategoryId(food),
    rating: food.rating,
    reviews: food.reviews,
    tag: food.tag || undefined,
  }
  showDishForm.value = true
}

const openDeleteFoodModal = (food: FoodItem) => {
  deleteFoodId.value = food._id
  deleteFoodName.value = food.name
  showDeleteFoodModal.value = true
}

const confirmDeleteFood = async () => {
  if (!deleteFoodId.value) return
  foodActionLoading.value = true
  try {
    await foodService.deleteFood(deleteFoodId.value)
    foods.value = foods.value.filter(f => f._id !== deleteFoodId.value)
    showDeleteFoodModal.value = false
    setFoodMessage({ text: 'Food deleted successfully', type: 'success' })
  } catch (err: any) {
    setFoodMessage({ text: err.response?.data?.message || 'Failed to delete food', type: 'error' })
  } finally {
    foodActionLoading.value = false
  }
}

const saveDish = async () => {
  const missing: string[] = []
  if (!dishForm.value.name.trim()) missing.push('Dish Name')
  if (!dishForm.value.description.trim()) missing.push('Description')
  if (!dishForm.value.price || dishForm.value.price <= 0) missing.push('Price')
  if (!dishForm.value.categoryId) missing.push('Category')
  if (!dishForm.value.image.trim()) missing.push('Image URL')
  if (missing.length) {
    setFoodMessage({ text: `Missing required fields: ${missing.join(', ')}`, type: 'error' })
    return
  }
  foodActionLoading.value = true
  try {
    const payload = {
      name: dishForm.value.name,
      description: dishForm.value.description,
      price: dishForm.value.price,
      image: dishForm.value.image,
      categoryId: dishForm.value.categoryId,
      rating: dishForm.value.rating,
      reviews: dishForm.value.reviews,
      tag: dishForm.value.tag || undefined,
    }
    if (editingFood.value) {
      const updated = await foodService.updateFood(editingFood.value._id, payload)
      const idx = foods.value.findIndex(f => f._id === editingFood.value!._id)
      if (idx !== -1) foods.value[idx] = updated
      setFoodMessage({ text: 'Food updated successfully', type: 'success' })
    } else {
      const created = await foodService.createFood(payload)
      foods.value.push(created)
      setFoodMessage({ text: 'Food created successfully', type: 'success' })
    }
    showDishForm.value = false
  } catch (err: any) {
    setFoodMessage({ text: err.response?.data?.message || 'Failed to save food', type: 'error' })
  } finally {
    foodActionLoading.value = false
  }
}


const filteredDishes = computed(() => foods.value.filter(f =>
  f.name.toLowerCase().includes(dishSearch.value.toLowerCase()) ||
  getCategoryName(f).toLowerCase().includes(dishSearch.value.toLowerCase())
))

const filteredOrders = computed(() => auth.orders.filter(o =>
  o.id.toLowerCase().includes(orderSearch.value.toLowerCase()) ||
  o.status.toLowerCase().includes(orderSearch.value.toLowerCase())
))

const navItems: { tab: Tab; label: string }[] = [
  { tab: 'dashboard', label: 'Dashboard' },
  { tab: 'food', label: 'Food Items' },
  { tab: 'users', label: 'Users' },
  { tab: 'orders', label: 'Orders' },
]

const navIcons = { dashboard: LayoutDashboard, food: UtensilsCrossed, users: Users, orders: ShoppingBag }
</script>

<template>
  <div v-if="auth.currentUser" class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside :class="['fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 flex flex-col transition-transform duration-300', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <div class="p-5 border-b border-gray-800">
        <router-link to="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
            <UtensilsCrossed class="w-5 h-5 text-white" />
          </div>
          <div>
            <p class="text-white text-sm" :style="{ fontWeight: 800 }">Mealio</p>
            <p class="text-gray-500 text-xs">Admin Panel</p>
          </div>
        </router-link>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <button
          v-for="item in navItems"
          :key="item.tab"
          @click="activeTab = item.tab; sidebarOpen = false"
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors', activeTab === item.tab ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
          :style="{ fontWeight: 600 }"
        >
          <component :is="navIcons[item.tab]" class="w-4 h-4" />
          {{ item.label }}
        </button>
      </nav>
      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3 mb-3 px-2">
          <div :class="['w-8 h-8', auth.currentUser.avatarColor, 'rounded-lg flex items-center justify-center flex-shrink-0']">
            <span class="text-white text-xs" :style="{ fontWeight: 700 }">{{ auth.currentUser.initials }}</span>
          </div>
          <div class="min-w-0">
            <p class="text-white text-xs truncate" :style="{ fontWeight: 600 }">{{ auth.currentUser.name }}</p>
            <p class="text-gray-500 text-[11px] truncate">{{ auth.currentUser.email }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl text-sm transition-colors" :style="{ fontWeight: 600 }">
          <LogOut class="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black/50 lg:hidden" @click="sidebarOpen = false" />

    <div class="flex-1 min-w-0 flex flex-col">
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <button class="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg" @click="sidebarOpen = true">
            <LayoutDashboard class="w-5 h-5" />
          </button>
          <h1 class="text-gray-900 text-lg" :style="{ fontWeight: 700 }">
            {{ navItems.find(n => n.tab === activeTab)?.label }}
          </h1>
        </div>
        <router-link to="/" class="text-sm text-gray-500 hover:text-green-600 transition-colors" :style="{ fontWeight: 500 }">← Back to Site</router-link>
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <!-- DASHBOARD -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="s in [
              { label: 'Total Dishes', value: foods.length, icon: UtensilsCrossed, color: 'bg-green-100 text-green-600', change: 'items on menu' },
              { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-100 text-blue-600', change: 'registered users' },
              { label: 'Total Orders', value: auth.orders.length, icon: ShoppingBag, color: 'bg-purple-100 text-purple-600', change: `${pendingOrders} pending` },
              { label: 'Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: TrendingUp, color: 'bg-amber-100 text-amber-600', change: 'from delivered orders' },
            ]" :key="s.label" class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div :class="['w-10 h-10', s.color, 'rounded-xl flex items-center justify-center mb-3']">
                <component :is="s.icon" class="w-5 h-5" />
              </div>
              <p class="text-gray-900 text-2xl" :style="{ fontWeight: 800 }">{{ s.value }}</p>
              <p class="text-gray-500 text-xs" :style="{ fontWeight: 600 }">{{ s.label }}</p>
              <p class="text-gray-400 text-xs mt-0.5">{{ s.change }}</p>
            </div>
          </div>

          <!-- Recent Orders -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">Recent Orders</h2>
              <button @click="activeTab = 'orders'" class="text-green-600 text-xs hover:underline" :style="{ fontWeight: 600 }">View all</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th v-for="h in ['Order ID', 'Items', 'Total', 'Status', 'Date']" :key="h" class="text-left px-6 py-3 text-xs text-gray-500" :style="{ fontWeight: 600 }">{{ h }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="order in auth.orders.slice(0, 5)" :key="order.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-3 text-xs text-gray-700" :style="{ fontWeight: 600 }">{{ order.id }}</td>
                    <td class="px-6 py-3 text-xs text-gray-500">{{ order.items.length }} items</td>
                    <td class="px-6 py-3 text-xs text-green-600" :style="{ fontWeight: 700 }">${{ order.total.toFixed(2) }}</td>
                    <td class="px-6 py-3">
                      <span :class="['inline-flex px-2.5 py-1 rounded-full text-xs', statusColor[order.status]]" :style="{ fontWeight: 600 }">{{ order.status }}</span>
                    </td>
                    <td class="px-6 py-3 text-xs text-gray-400">{{ new Date(order.date).toLocaleDateString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="grid sm:grid-cols-3 gap-4">
            <button v-for="s in [
              { label: 'Add Food Item', desc: 'Add a new dish to the menu', tab: 'food' as Tab, icon: '🍽️' },
              { label: 'Manage Users', desc: 'View and manage user accounts', tab: 'users' as Tab, icon: '👥' },
              { label: 'View Orders', desc: 'Track and update order status', tab: 'orders' as Tab, icon: '📦' },
            ]" :key="s.label" @click="activeTab = s.tab" class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-green-200 hover:shadow-md transition-all text-left group">
              <span class="text-2xl block mb-2">{{ s.icon }}</span>
              <p class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">{{ s.label }}</p>
              <p class="text-gray-400 text-xs mt-0.5">{{ s.desc }}</p>
            </button>
          </div>
        </div>

        <!-- FOOD ITEMS -->
        <div v-if="activeTab === 'food'">
          <!-- Message toast -->
          <div v-if="foodMessage" :class="['mb-4 px-4 py-3 rounded-xl text-sm', foodMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']" :style="{ fontWeight: 600 }">
            {{ foodMessage.text }}
            <button @click="foodMessage = null" class="float-right opacity-60 hover:opacity-100">&times;</button>
          </div>

          <div class="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="dishSearch" type="text" placeholder="Search dishes..." class="pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-none focus:border-green-400 w-64" />
            </div>
            <div class="flex gap-2">
              <button @click="fetchFoods" class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-sm" :style="{ fontWeight: 600 }">
                Refresh
              </button>
              <button @click="openAddDish" class="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all text-sm" :style="{ fontWeight: 700 }">
                <Plus class="w-4 h-4" /> Add Dish
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="foodsLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
            <Loader2 class="w-6 h-6 text-green-600 animate-spin mx-auto mb-2" />
            <p class="text-gray-400 text-sm">Loading foods...</p>
          </div>

          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th v-for="h in ['Dish', 'Category', 'Price', 'Rating', 'Tag', 'Actions']" :key="h" class="text-left px-5 py-3 text-xs text-gray-500" :style="{ fontWeight: 600 }">{{ h }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="food in filteredDishes" :key="food._id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-3">
                        <img :src="food.image" :alt="food.name" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div class="min-w-0">
                          <p class="text-gray-900 text-xs truncate max-w-[140px]" :style="{ fontWeight: 600 }">{{ food.name }}</p>
                          <p class="text-gray-400 text-[11px] truncate max-w-[140px]">{{ food.description.substring(0, 40) }}…</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-3"><span class="capitalize text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full" :style="{ fontWeight: 600 }">{{ getCategoryName(food) }}</span></td>
                    <td class="px-5 py-3 text-green-600 text-sm" :style="{ fontWeight: 700 }">{{ new Intl.NumberFormat('vi-VN').format(food.price)}}₫</td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-1">
                        <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span class="text-xs text-gray-700" :style="{ fontWeight: 600 }">{{ food.rating }}</span>
                      </div>
                    </td>
                    <td class="px-5 py-3">
                      <span v-if="food.tag" class="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full" :style="{ fontWeight: 500 }">{{ food.tag }}</span>
                      <span v-else class="text-gray-400 text-xs">—</span>
                    </td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-2">
                        <button @click="openEditDish(food)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="openDeleteFoodModal(food)" class="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="filteredDishes.length === 0" class="py-12 text-center text-gray-400 text-sm">No dishes found.</div>
          </div>
        </div>

        <!-- USERS -->
        <div v-if="activeTab === 'users'">
          <!-- Message toast -->
          <div v-if="userMessage" :class="['mb-4 px-4 py-3 rounded-xl text-sm', userMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']" :style="{ fontWeight: 600 }">
            {{ userMessage.text }}
            <button @click="userMessage = null" class="float-right opacity-60 hover:opacity-100">&times;</button>
          </div>

          <div class="flex items-center justify-between mb-5 gap-3 flex-wrap">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="userSearch" type="text" placeholder="Search users..." class="pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-none focus:border-green-400 w-64" />
            </div>
            <button @click="fetchUsers" class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-sm" :style="{ fontWeight: 600 }">
              Refresh
            </button>
          </div>

          <!-- Loading -->
          <div v-if="usersLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
            <p class="text-gray-400 text-sm">Loading users...</p>
          </div>

          <!-- Users table -->
          <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th v-for="h in ['User', 'Email', 'Role', 'Joined', 'Actions']" :key="h" class="text-left px-5 py-3 text-xs text-gray-500" :style="{ fontWeight: 600 }">{{ h }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-3">
                        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', getUserAvatarColor(user.name)]">
                          <span class="text-white text-xs" :style="{ fontWeight: 700 }">{{ getUserInitials(user.name) }}</span>
                        </div>
                        <p class="text-gray-900 text-xs" :style="{ fontWeight: 600 }">{{ user.name }}</p>
                      </div>
                    </td>
                    <td class="px-5 py-3 text-xs text-gray-500">{{ user.email }}</td>
                    <td class="px-5 py-3">
                      <div class="relative inline-block">
                        <select
                          :value="user.role"
                          @change="changeRole(user._id, ($event.target as HTMLSelectElement).value)"
                          :disabled="user._id === auth.currentUser?._id"
                          :class="['appearance-none text-xs px-2.5 py-1.5 pr-7 rounded-full border outline-none capitalize', user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-green-50 text-green-700 border-green-200', user._id === auth.currentUser?._id ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer']"
                          :style="{ fontWeight: 600 }"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown class="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td class="px-5 py-3 text-xs text-gray-400">{{ new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</td>
                    <td class="px-5 py-3">
                      <span v-if="user._id === auth.currentUser?._id" class="text-xs text-gray-400 italic">You</span>
                      <div v-else class="flex items-center gap-2">
                        <button @click="openPasswordModal(user)" class="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reset password">
                          <Pencil class="w-3.5 h-3.5" />
                        </button>
                        <button @click="openDeleteModal(user)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete user">
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="filteredUsers.length === 0" class="py-12 text-center text-gray-400 text-sm">No users found.</div>
          </div>
        </div>

        <!-- ORDERS -->
        <div v-if="activeTab === 'orders'">
          <div class="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="orderSearch" type="text" placeholder="Search by ID or status..." class="pl-9 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm outline-none focus:border-green-400 w-72" />
            </div>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="s in ['All', ...STATUS_OPTIONS]"
                :key="s"
                @click="orderSearch = s === 'All' ? '' : s"
                :class="[
                  'text-xs px-3 py-1.5 rounded-full transition-colors',
                  (s === 'All' && !orderSearch) || orderSearch === s
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
                ]"
                :style="{ fontWeight: 600 }"
              >
                {{ s }}
              </button>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th v-for="h in ['Order ID', 'Items', 'Customer', 'Total', 'Status', 'Date']" :key="h" class="text-left px-5 py-3 text-xs text-gray-500" :style="{ fontWeight: 600 }">{{ h }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-3 text-xs text-gray-700" :style="{ fontWeight: 600 }">{{ order.id }}</td>
                    <td class="px-5 py-3">
                      <div class="flex -space-x-1.5">
                        <img v-for="item in order.items.slice(0, 3)" :key="item.id" :src="item.image" :alt="item.name" class="w-7 h-7 rounded-md object-cover border border-white" />
                        <div v-if="order.items.length > 3" class="w-7 h-7 rounded-md bg-gray-100 border border-white flex items-center justify-center">
                          <span class="text-[10px] text-gray-500" :style="{ fontWeight: 600 }">+{{ order.items.length - 3 }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-5 py-3">
                      <span class="text-xs text-gray-500" :style="{ fontWeight: 500 }">User #{{ order.userId }}</span>
                    </td>
                    <td class="px-5 py-3 text-green-600 text-sm" :style="{ fontWeight: 700 }">${{ order.total.toFixed(2) }}</td>
                    <td class="px-5 py-3">
                      <div class="relative inline-block">
                        <select
                          :value="order.status"
                          @change="auth.updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value as OrderStatus)"
                          :class="['appearance-none text-xs px-2.5 py-1.5 pr-6 rounded-full border cursor-pointer outline-none', statusColor[order.status]]"
                          :style="{ fontWeight: 600, borderColor: 'transparent' }"
                        >
                          <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">{{ s }}</option>
                        </select>
                        <ChevronDown class="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td class="px-5 py-3 text-xs text-gray-400">{{ new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="filteredOrders.length === 0" class="py-12 text-center text-gray-400 text-sm">No orders found.</div>
          </div>
        </div>
      </main>
    </div>

    <!-- DISH FORM MODAL -->
    <div v-if="showDishForm" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-gray-900 text-base" :style="{ fontWeight: 700 }">{{ editingFood ? 'Edit Dish' : 'Add New Dish' }}</h2>
          <button @click="showDishForm = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X class="w-4 h-4 text-gray-500" /></button>
        </div>
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Dish Name *</label>
              <input v-model="dishForm.name" type="text" placeholder="e.g. Margherita Pizza" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400" />
            </div>
            <div class="col-span-2">
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Description *</label>
              <textarea v-model="dishForm.description" placeholder="Short description..." rows="2" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 resize-none"></textarea>
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Price (₫) *</label>
              <input v-model.number="dishForm.price" type="number" step="0.01" min="0" placeholder="12.99" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Category *</label>
              <select v-model="dishForm.categoryId" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 capitalize">
                <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Image URL *</label>
              <input v-model="dishForm.image" type="url" placeholder="https://..." class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Rating (0-5)</label>
              <input v-model.number="dishForm.rating" type="number" step="0.1" min="0" max="5" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Tag (optional)</label>
              <select v-model="dishForm.tag" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400">
                <option :value="undefined">None</option>
                <option v-for="t in tagOptions" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showDishForm = false" class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors" :style="{ fontWeight: 600 }">Cancel</button>
          <button @click="saveDish" :disabled="foodActionLoading" class="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 active:scale-95 transition-all" :style="{ fontWeight: 700 }">
            <Loader2 v-if="foodActionLoading" class="w-4 h-4 animate-spin" />
            <Check v-else class="w-4 h-4" />
            {{ editingFood ? 'Save Changes' : 'Add Dish' }}
          </button>
        </div>
      </div>
    </div>
    <!-- PASSWORD RESET MODAL -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-gray-900 text-base" :style="{ fontWeight: 700 }">Reset Password</h2>
          <button @click="showPasswordModal = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X class="w-4 h-4 text-gray-500" /></button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">Set a new password for <span :style="{ fontWeight: 700 }">{{ passwordUserName }}</span></p>
          <div>
            <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">New Password *</label>
            <input v-model="newPassword" type="password" placeholder="Minimum 8 characters" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400" />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showPasswordModal = false" class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors" :style="{ fontWeight: 600 }">Cancel</button>
          <button @click="savePassword" :disabled="userActionLoading || newPassword.length < 8" :class="['flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all', newPassword.length >= 8 ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed']" :style="{ fontWeight: 700 }">
            <Check class="w-4 h-4" />
            Update Password
          </button>
        </div>
      </div>
    </div>
    <!-- DELETE FOOD CONFIRM MODAL -->
    <div v-if="showDeleteFoodModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-gray-900 text-base" :style="{ fontWeight: 700 }">Delete Food</h2>
          <button @click="showDeleteFoodModal = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X class="w-4 h-4 text-gray-500" /></button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600">Are you sure you want to delete <span :style="{ fontWeight: 700 }">{{ deleteFoodName }}</span>? This action cannot be undone.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showDeleteFoodModal = false" class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors" :style="{ fontWeight: 600 }">Cancel</button>
          <button @click="confirmDeleteFood" :disabled="foodActionLoading" class="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 active:scale-95 transition-all" :style="{ fontWeight: 700 }">
            <Loader2 v-if="foodActionLoading" class="w-4 h-4 animate-spin" />
            <Trash2 v-else class="w-4 h-4" />
            Delete Food
          </button>
        </div>
      </div>
    </div>
    <!-- DELETE USER CONFIRM MODAL -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-gray-900 text-base" :style="{ fontWeight: 700 }">Delete User</h2>
          <button @click="showDeleteModal = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X class="w-4 h-4 text-gray-500" /></button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600">Are you sure you want to delete <span :style="{ fontWeight: 700 }">{{ deleteUserName }}</span>? This action cannot be undone.</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showDeleteModal = false" class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors" :style="{ fontWeight: 600 }">Cancel</button>
          <button @click="confirmDeleteUser" :disabled="userActionLoading" class="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 active:scale-95 transition-all" :style="{ fontWeight: 700 }">
            <Trash2 class="w-4 h-4" />
            Delete User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
