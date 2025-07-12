import api from './api'

export interface User {
  id: string
  email: string
  user_metadata?: {
    name?: string
    phone?: string
    bio?: string
    avatar_url?: string
  }
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  bio?: string
  avatar_url?: string
  points: number
  role: 'user' | 'admin'
  referral_code: string
  created_at: string
  updated_at: string
}

export interface SwapHistory {
  id: string
  sender_id: string
  receiver_id: string
  listing_id: string
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  sender_name: string
  receiver_name: string
  item_title: string
  item_image?: string
}

export interface PointsHistory {
  id: string
  user_id: string
  points: number
  action: string
  description: string
  created_at: string
}

class ProfileService {
  // Get user profile by user ID
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await api.get(`/profile/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await api.post('/profile', profile)
      return response.data
    } catch (error) {
      console.error('Error upserting user profile:', error)
      return null
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await api.put(`/profile/${userId}`, updates)
      return response.data
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }

  // Get user's swap history
  async getSwapHistory(userId: string): Promise<SwapHistory[]> {
    try {
      const response = await api.get(`/profile/${userId}/swaps`)
      return response.data
    } catch (error) {
      console.error('Error fetching swap history:', error)
      return []
    }
  }

  // Get user's points history
  async getPointsHistory(userId: string): Promise<PointsHistory[]> {
    try {
      const response = await api.get(`/profile/${userId}/points`)
      return response.data
    } catch (error) {
      console.error('Error fetching points history:', error)
      return []
    }
  }

  // Add points to user
  async addPoints(userId: string, points: number, action: string, description: string): Promise<boolean> {
    try {
      const response = await api.post(`/profile/${userId}/points`, {
        points,
        action,
        description
      })
      return response.status === 200
    } catch (error) {
      console.error('Error in addPoints:', error)
      return false
    }
  }

  // Generate referral code
  generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Create initial profile for new user
  async createInitialProfile(user: User): Promise<UserProfile | null> {
    const profile: Partial<UserProfile> = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      phone: user.user_metadata?.phone || '',
      bio: user.user_metadata?.bio || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      points: 0,
      role: 'user',
      referral_code: this.generateReferralCode()
    }

    return this.upsertUserProfile(profile)
  }

  // Upload profile avatar
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await api.post(`/profile/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data.avatarUrl
    } catch (error) {
      console.error('Error in uploadAvatar:', error)
      return null
    }
  }
}

export const profileService = new ProfileService() 