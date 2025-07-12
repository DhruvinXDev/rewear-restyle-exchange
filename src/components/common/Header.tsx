import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Recycle, User, Menu, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      })
      navigate("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while signing out.",
        variant: "destructive"
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground group-hover:scale-110 smooth-transition">
              <Recycle className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-foreground">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary smooth-transition font-medium">
              Home
            </Link>
            <Link to="/browse" className="text-foreground hover:text-primary smooth-transition font-medium">
              Browse
            </Link>
            <Link to="/add-listing" className="text-foreground hover:text-primary smooth-transition font-medium">
              Add Listing
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary smooth-transition font-medium">
              Dashboard
            </Link>
            <Link to="/admin-login" className="text-foreground hover:text-primary smooth-transition font-medium">
              Admin Login
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent smooth-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50 animate-fadeInUp">
            <Link to="/" className="block text-foreground hover:text-primary smooth-transition font-medium">
              Home
            </Link>
            <Link to="/browse" className="block text-foreground hover:text-primary smooth-transition font-medium">
              Browse
            </Link>
            <Link to="/add-listing" className="block text-foreground hover:text-primary smooth-transition font-medium">
              Add Listing
            </Link>
            <Link to="/dashboard" className="block text-foreground hover:text-primary smooth-transition font-medium">
              Dashboard
            </Link>
            <Link to="/admin-login" className="block text-foreground hover:text-primary smooth-transition font-medium">
              Admin Login
            </Link>
            <div className="flex space-x-4 pt-4">
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header