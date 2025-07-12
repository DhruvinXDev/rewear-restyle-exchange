import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { Shield, Eye, EyeOff, ArrowRight, AlertTriangle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { profileService } from "@/services/profileService"

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const { toast } = useToast()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError || !authData.user) {
        toast({
          title: "Login failed",
          description: authError?.message || "Invalid credentials",
          variant: "destructive"
        })
        return
      }

      // Step 2: Check role from user_profiles
      const profileData = await profileService.getUserProfile(authData.user.id)

      if (!profileData) {
        // Create profile if it doesn't exist
        const newProfile = await profileService.createInitialProfile(authData.user)
        if (!newProfile) {
          toast({
            title: "Error",
            description: "Failed to create user profile",
            variant: "destructive"
          })
          return
        }
      }

      // Get the profile data (either existing or newly created)
      const userProfile = profileData || await profileService.getUserProfile(authData.user.id)

      if (!userProfile) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive"
        })
        return
      }

      // Step 3: Check if user is admin
      if (userProfile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the admin panel. Only admins can access this area.",
          variant: "destructive"
        })
        
        // Sign out the user since they're not an admin
        await supabase.auth.signOut()
        return
      }

      // Step 4: Success - redirect to admin panel
      toast({
        title: "Welcome, Admin!",
        description: "You have successfully signed in to the admin panel.",
      })
      
      navigate("/admin")

    } catch (error) {
      console.error('Admin login error:', error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        {/* Admin Access Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center floating-animation glass-card">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground">Sign in with your admin account to continue</p>
          
          {/* Admin Access Notice */}
          <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Only authorized ReWear admins can access this panel
              </p>
            </div>
          </div>
        </div>

        {/* Admin Login Form */}
        <div className="glass-card p-8 animate-fadeInUp">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Admin Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-modern h-12"
                placeholder="Enter your admin email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-modern h-12 pr-12"
                  placeholder="Enter your admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground smooth-transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary h-12 animate-pulse-glow"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In as Admin"} 
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Need help?</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Contact the system administrator if you need admin access
              </p>
              <Link
                to="/"
                className="text-primary hover:text-primary-dark font-medium smooth-transition"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secure admin access with role-based authentication</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin 