import api from './api'
import type { AuthResponse, UserProfile } from '../types'

interface SimpleResponse {
  success: boolean
  message: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    return data
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
    return data
  },

  async logout(email: string): Promise<void> {
    await api.post('/auth/logout', { email })
  },

  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<{ success: boolean; user: UserProfile }>('/users/profile')
    return data.user
  },

  async updateProfile(body: { name?: string; phone?: string; address?: { street?: string; city?: string } }): Promise<UserProfile> {
    const { data } = await api.patch<{ success: boolean; user: UserProfile }>('/users/update-profile', body)
    return data.user
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const { data } = await api.get<{ success: boolean; users: UserProfile[] }>('/users/all-users')
    return data.users
  },

  async adminUpdateUser(userId: string, body: { role?: string; password?: string }): Promise<UserProfile> {
    const { data } = await api.patch<{ success: boolean; user: UserProfile }>(`/users/${userId}`, body)
    return data.user
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`)
  },

  // Email verification
  async verifyEmail(token: string): Promise<SimpleResponse> {
    const { data } = await api.get<SimpleResponse>(`/auth/verify-email?token=${token}`)
    return data
  },

  async resendVerification(email: string): Promise<SimpleResponse> {
    const { data } = await api.post<SimpleResponse>('/auth/resend-verification', { email })
    return data
  },

  // Forgot / Reset password
  async forgotPassword(email: string): Promise<SimpleResponse> {
    const { data } = await api.post<SimpleResponse>('/auth/forgot-password', { email })
    return data
  },

  async resetPassword(token: string, password: string): Promise<SimpleResponse> {
    const { data } = await api.post<SimpleResponse>('/auth/reset-password', { token, password })
    return data
  },
}
