import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'

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
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getUserProfile:', error)
      return null
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        console.error('Error upserting user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in upsertUserProfile:', error)
      return null
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateUserProfile:', error)
      return null
    }
  }

  // Get user's swap history
  async getSwapHistory(userId: string): Promise<SwapHistory[]> {
    try {
      const { data, error } = await supabase
        .from('swap_history')
        .select(`
          *,
          sender:user_profiles!swap_history_sender_id_fkey(name),
          receiver:user_profiles!swap_history_receiver_id_fkey(name),
          listing:listings(title, image_url)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching swap history:', error)
        return []
      }

      return data?.map(item => ({
        id: item.id,
        sender_id: item.sender_id,
        receiver_id: item.receiver_id,
        listing_id: item.listing_id,
        status: item.status,
        created_at: item.created_at,
        sender_name: item.sender?.name || 'Unknown',
        receiver_name: item.receiver?.name || 'Unknown',
        item_title: item.listing?.title || 'Unknown Item',
        item_image: item.listing?.image_url
      })) || []
    } catch (error) {
      console.error('Error in getSwapHistory:', error)
      return []
    }
  }

  // Get user's points history
  async getPointsHistory(userId: string): Promise<PointsHistory[]> {
    try {
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching points history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getPointsHistory:', error)
      return []
    }
  }

  // Add points to user
  async addPoints(userId: string, points: number, action: string, description: string): Promise<boolean> {
    try {
      // Start a transaction
      const { error: pointsError } = await supabase
        .from('points_history')
        .insert({
          user_id: userId,
          points,
          action,
          description
        })

      if (pointsError) {
        console.error('Error adding points history:', pointsError)
        return false
      }

      // Update user's total points
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          points: supabase.rpc('increment_points', { user_id: userId, points_to_add: points })
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating user points:', updateError)
        return false
      }

      return true
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
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (error) {
        console.error('Error uploading avatar:', error)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error in uploadAvatar:', error)
      return null
    }
  }
}

export const profileService = new ProfileService() 