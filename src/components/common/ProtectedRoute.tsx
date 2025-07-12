import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireGuest?: boolean
  redirectTo?: string
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = false, 
  requireGuest = false, 
  redirectTo 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return // Wait for auth to load

    if (requireAuth && !user) {
      // User must be logged in but isn't
      navigate('/login')
    } else if (requireGuest && user) {
      // User must be a guest but is logged in
      navigate(redirectTo || '/')
    }
  }, [user, loading, requireAuth, requireGuest, redirectTo, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If requireAuth is true and user is not logged in, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If requireGuest is true and user is logged in, don't render children
  if (requireGuest && user) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute 