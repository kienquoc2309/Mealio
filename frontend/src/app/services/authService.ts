import api from './api'

export interface AuthResponse {
  success: boolean
  message: string
  accessToken?: string
  refreshToken?: string
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
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

  async updateProfile(body: { name?: string; phone?: string; address?: string }): Promise<UserProfile> {
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
}
