import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { authService } from '../services/authService'
import { useCartStore } from './cart'
import type { Theme, CurrentUser, UserProfile } from '../types'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500',
  'bg-green-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
]

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function profileToCurrentUser(profile: UserProfile): CurrentUser {
  return {
    _id: profile._id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    phone: profile.phone ?? '',
    address: profile.address ?? { street: '', city: '' },
    createdAt: profile.createdAt,
    initials: getInitials(profile.name),
    avatarColor: getAvatarColor(profile.name),
  }
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<CurrentUser | null>(null)
  const theme = ref<Theme>((localStorage.getItem('mealio-theme') as Theme) || 'light')
  const loading = ref(false)

  watch(theme, (val) => {
    const root = document.getElementById('app-root')
    if (root) {
      root.classList.toggle('dark', val === 'dark')
    }
  })

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    try {
      const res = await authService.login(email, password)
      if (res.success && res.accessToken && res.refreshToken) {
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        const profile = await authService.getProfile()
        currentUser.value = profileToCurrentUser(profile)
        useCartStore().fetchCart()
        return { success: true, message: res.message }
      }
      return { success: false, message: res.message || 'Login failed' }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    try {
      const res = await authService.register(name, email, password)
      if (res.success && res.accessToken && res.refreshToken) {
        localStorage.setItem('accessToken', res.accessToken)
        localStorage.setItem('refreshToken', res.refreshToken)
        const profile = await authService.getProfile()
        currentUser.value = profileToCurrentUser(profile)
        useCartStore().fetchCart()
        return { success: true, message: res.message }
      }
      return { success: false, message: res.message || 'Registration failed' }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      if (currentUser.value) {
        await authService.logout(currentUser.value.email)
      }
    } catch {
      // Proceed with local logout even if server call fails
    } finally {
      currentUser.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      useCartStore().cartItems = []
    }
  }

  const restoreSession = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    loading.value = true
    try {
      const profile = await authService.getProfile()
      currentUser.value = profileToCurrentUser(profile)
      useCartStore().fetchCart()
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (data: { name?: string; phone?: string; address?: { street?: string; city?: string } }): Promise<{ success: boolean; message: string }> => {
    if (!currentUser.value) return { success: false, message: 'Not logged in' }
    try {
      const profile = await authService.updateProfile(data)
      currentUser.value = profileToCurrentUser(profile)
      return { success: true, message: 'Profile updated successfully' }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile'
      return { success: false, message }
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('mealio-theme', theme.value)
  }

  return {
    currentUser,
    theme,
    loading,
    login,
    register,
    logout,
    restoreSession,
    updateProfile,
    toggleTheme,
  }
})
