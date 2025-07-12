import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  bio?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    role: 'user' | 'admin'
    points: number
  }
  token: string
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    const { user, token } = response.data
    
    // Store token and user data
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return response.data
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    const { user, token } = response.data
    
    // Store token and user data
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return response.data
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  // Get current user
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post('/auth/refresh')
      const { token } = response.data
      localStorage.setItem('authToken', token)
      return token
    } catch (error) {
      console.error('Token refresh error:', error)
      return null
    }
  }

  // Verify token
  async verifyToken(): Promise<boolean> {
    try {
      await api.get('/auth/verify')
      return true
    } catch (error) {
      return false
    }
  }
}

export const authService = new AuthService() 