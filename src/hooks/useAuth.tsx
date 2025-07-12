import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authService, AuthResponse } from '@/services/authService'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  points: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    setUser(response.user)
  }

  const register = async (data: any) => {
    const response = await authService.register(data)
    setUser(response.user)
  }

  const signOut = async () => {
    await authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signOut,
    login,
    register
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}