import type { UserRole, UserAddress } from './common'

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
  role: UserRole
  phone?: string
  address?: UserAddress
  createdAt: string
  updatedAt: string
}

export interface CurrentUser {
  _id: string
  name: string
  email: string
  role: UserRole
  phone: string
  address: UserAddress
  createdAt: string
  initials: string
  avatarColor: string
}
