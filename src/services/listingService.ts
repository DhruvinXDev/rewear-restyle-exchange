import api from './api'

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  image_url?: string
  category: string
  condition: string
  points: number
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  created_at: string
  updated_at: string
  seller_name?: string
  seller_avatar?: string
}

export interface CreateListingData {
  title: string
  description: string
  category: string
  type?: string
  size?: string
  condition: string
  tags?: string
  location?: string
  points?: number
  image?: File
}

export interface UpdateListingData {
  title?: string
  description?: string
  category?: string
  condition?: string
  points?: number
}

class ListingService {
  // Get all listings
  async getAllListings(filters?: { category?: string; status?: string; userId?: string }): Promise<Listing[]> {
    try {
      const params = new URLSearchParams()
      if (filters?.category) params.append('category', filters.category)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.userId) params.append('userId', filters.userId)

      const response = await api.get(`/listings?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching listings:', error)
      return []
    }
  }

  // Get listing by ID
  async getListingById(id: string): Promise<Listing | null> {
    try {
      const response = await api.get(`/listings/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching listing:', error)
      return null
    }
  }

  // Create new listing
  async createListing(data: CreateListingData): Promise<Listing | null> {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('category', data.category)
      formData.append('condition', data.condition)
      
      if (data.type) formData.append('type', data.type)
      if (data.size) formData.append('size', data.size)
      if (data.tags) formData.append('tags', data.tags)
      if (data.location) formData.append('location', data.location)
      if (data.points) formData.append('points', data.points.toString())
      if (data.image) formData.append('image', data.image)

      const response = await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.listing
    } catch (error) {
      console.error('Error creating listing:', error)
      throw error
    }
  }

  // Update listing
  async updateListing(id: string, data: UpdateListingData): Promise<boolean> {
    try {
      await api.put(`/listings/${id}`, data)
      return true
    } catch (error) {
      console.error('Error updating listing:', error)
      return false
    }
  }

  // Delete listing
  async deleteListing(id: string): Promise<boolean> {
    try {
      await api.delete(`/listings/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting listing:', error)
      return false
    }
  }

  // Get user's listings
  async getUserListings(userId: string): Promise<Listing[]> {
    try {
      const response = await api.get(`/listings/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user listings:', error)
      return []
    }
  }

  // Get categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get('/listings/categories')
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Get conditions
  async getConditions(): Promise<string[]> {
    try {
      const response = await api.get('/listings/conditions')
      return response.data
    } catch (error) {
      console.error('Error fetching conditions:', error)
      return []
    }
  }

  // Get status badge color
  getStatusColor(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'spam':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status badge text
  getStatusText(status: string): string {
    switch (status) {
      case 'approved':
        return 'Approved'
      case 'pending':
        return 'Pending'
      case 'rejected':
        return 'Rejected'
      case 'spam':
        return 'Spam'
      default:
        return 'Unknown'
    }
  }
}

export const listingService = new ListingService() 