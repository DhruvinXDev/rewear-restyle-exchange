import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Search, 
  Ban, 
  Shield, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
  AlertTriangle,
  LogOut,
  Loader2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import Header from "@/components/common/Header"
import product1 from "@/assets/product-1.jpg"
import product2 from "@/assets/product-2.jpg"
import product3 from "@/assets/product-3.jpg"

const Admin = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("users")

  // Check if user is admin by fetching from database
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      try {
        // Check if user is admin from localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        if (currentUser.role === 'admin') {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel. Please use admin login.",
            variant: "destructive"
          })
          navigate("/admin-login")
        }
      } catch (error) {
        console.error('Error checking admin role:', error)
        setIsAdmin(false)
        toast({
          title: "Error",
          description: "Failed to verify admin permissions.",
          variant: "destructive"
        })
        navigate("/admin-login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminRole()
  }, [user, navigate, toast])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => navigate("/admin-login")}>
              Go to Admin Login
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock data
  const users = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "",
      joinDate: "2024-01-15",
      points: 85,
      totalListings: 8,
      totalSwaps: 12,
      status: "active",
      role: "user"
    },
    {
      id: "2",
      name: "Sarah Chen",
      email: "sarah@example.com",
      avatar: "",
      joinDate: "2024-01-10",
      points: 120,
      totalListings: 15,
      totalSwaps: 18,
      status: "active",
      role: "user"
    },
    {
      id: "3",
      name: "Maria Garcia",
      email: "maria@example.com",
      avatar: "",
      joinDate: "2024-01-05",
      points: 45,
      totalListings: 3,
      totalSwaps: 5,
      status: "banned",
      role: "user"
    }
  ]

  const listings = [
    {
      id: "1",
      title: "Vintage Denim Jacket",
      image: product1,
      seller: "Alex Johnson",
      category: "Jackets",
      condition: "Excellent",
      points: 25,
      status: "pending",
      reportCount: 0,
      postedDate: "2024-01-20"
    },
    {
      id: "2",
      title: "Floral Summer Dress",
      image: product2,
      seller: "Sarah Chen",
      category: "Dresses",
      condition: "Good",
      points: 20,
      status: "approved",
      reportCount: 1,
      postedDate: "2024-01-18"
    },
    {
      id: "3",
      title: "Cozy Knit Sweater",
      image: product3,
      seller: "Maria Garcia",
      category: "Sweaters",
      condition: "Fair",
      points: 15,
      status: "rejected",
      reportCount: 3,
      postedDate: "2024-01-15"
    }
  ]

  const orders = [
    {
      id: "o1",
      swapper: "Alex Johnson",
      item: "Vintage Denim Jacket",
      swappedWith: "Sarah Chen",
      status: "completed",
      swapDate: "2024-01-19",
      value: 25
    },
    {
      id: "o2",
      swapper: "Sarah Chen",
      item: "Floral Summer Dress",
      swappedWith: "Maria Garcia",
      status: "pending",
      swapDate: "2024-01-20",
      value: 20
    }
  ]

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user ${userId}`)
    
    switch (action) {
      case 'ban':
        toast({
          title: "User Banned",
          description: "User has been banned successfully.",
          variant: "destructive"
        })
        break
      case 'unban':
        toast({
          title: "User Unbanned",
          description: "User has been unbanned successfully.",
        })
        break
      case 'promote':
        toast({
          title: "User Promoted",
          description: "User has been promoted to admin successfully.",
        })
        break
      case 'delete':
        toast({
          title: "User Deleted",
          description: "User has been deleted successfully.",
          variant: "destructive"
        })
        break
      default:
        break
    }
  }

  const handleListingAction = (listingId: string, action: string) => {
    console.log(`${action} listing ${listingId}`)
    
    switch (action) {
      case 'approve':
        toast({
          title: "Listing Approved",
          description: "Listing has been approved successfully.",
        })
        break
      case 'reject':
        toast({
          title: "Listing Rejected",
          description: "Listing has been rejected successfully.",
          variant: "destructive"
        })
        break
      case 'delete':
        toast({
          title: "Listing Deleted",
          description: "Listing has been deleted successfully.",
          variant: "destructive"
        })
        break
      default:
        break
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success">Active</Badge>
      case "banned":
        return <Badge className="bg-destructive/20 text-destructive">Banned</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning">Pending</Badge>
      case "approved":
        return <Badge className="bg-success/20 text-success">Approved</Badge>
      case "rejected":
        return <Badge className="bg-destructive/20 text-destructive">Rejected</Badge>
      case "completed":
        return <Badge className="bg-success/20 text-success">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Admin Panel
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage users, listings, and platform operations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <Users className="w-8 h-8 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Package className="w-8 h-8 mx-auto text-accent mb-2" />
            <div className="text-2xl font-bold text-foreground">{listings.length}</div>
            <div className="text-sm text-muted-foreground">Total Listings</div>
          </div>
          <div className="glass-card p-6 text-center">
            <ShoppingCart className="w-8 h-8 mx-auto text-success mb-2" />
            <div className="text-2xl font-bold text-foreground">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </div>
          <div className="glass-card p-6 text-center">
            <Shield className="w-8 h-8 mx-auto text-warning mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {listings.filter(l => l.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Manage Listings
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Manage Orders
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="user-card animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Joined</p>
                        <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Points</p>
                        <p className="font-medium text-primary">{user.points}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Activity</p>
                        <p className="font-medium">{user.totalSwaps} swaps, {user.totalListings} listings</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.status)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserAction(user.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {user.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, 'ban')}
                              className="text-destructive"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user.id, 'unban')}
                              className="text-success"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Unban User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'promote')}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="mt-6">
            <div className="space-y-4">
              {listings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="user-card animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">by {listing.seller}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">{listing.category}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Condition</p>
                        <p className="font-medium">{listing.condition}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Points</p>
                        <p className="font-medium text-primary">{listing.points}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(listing.status)}
                        {listing.reportCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {listing.reportCount} reports
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleListingAction(listing.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {listing.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleListingAction(listing.id, 'approve')}
                            className="text-success border-success hover:bg-success/10"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleListingAction(listing.id, 'reject')}
                            className="text-destructive border-destructive hover:bg-destructive/10"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleListingAction(listing.id, 'delete')}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className="user-card animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="font-semibold text-foreground">{order.item}</p>
                        <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Swapper</p>
                        <p className="font-medium">{order.swapper}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Swapped With</p>
                        <p className="font-medium">{order.swappedWith}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(order.swapDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}
                        <span className="text-sm text-primary font-medium">{order.value} pts</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Admin