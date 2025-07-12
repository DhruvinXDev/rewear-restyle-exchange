import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { authService } from '@/services/authService'
import { profileService, UserProfile, SwapHistory, PointsHistory } from '@/services/profileService'
import { listingService, Listing } from '@/services/listingService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Package, 
  RefreshCw, 
  Coins, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  TrendingUp,
  Settings,
  Home,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('listings')
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([])
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([])

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    bio: ''
  })

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    loadDashboardData()
  }, [navigate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const currentUser = authService.getCurrentUser()
      
      if (!currentUser) {
        navigate('/login')
        return
      }

      // Load all data in parallel
      const [userData, listingsData, swapsData, pointsData] = await Promise.all([
        profileService.getUserProfile(currentUser.id),
        listingService.getUserListings(currentUser.id),
        profileService.getSwapHistory(currentUser.id),
        profileService.getPointsHistory(currentUser.id)
      ])

      setUser(userData)
      setListings(listingsData)
      setSwapHistory(swapsData)
      setPointsHistory(pointsData)

      // Initialize edit form
      if (userData) {
        setEditForm({
          name: userData.name,
          phone: userData.phone || '',
          bio: userData.bio || ''
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const success = await listingService.deleteListing(listingId)
      if (success) {
        toast({
          title: "Success",
          description: "Listing deleted successfully"
        })
        // Reload listings
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          const updatedListings = await listingService.getUserListings(currentUser.id)
          setListings(updatedListings)
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete listing",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive"
      })
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      const updatedUser = await profileService.updateUserProfile(user.id, editForm)
      if (updatedUser) {
        setUser(updatedUser)
        setEditProfileOpen(false)
        toast({
          title: "Success",
          description: "Profile updated successfully"
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/')
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">User not found</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/add-listing')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Listing
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Overview Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 ring-4 ring-blue-100">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                      <Coins className="h-3 w-3" />
                      {user.points} Points
                    </Badge>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile} className="flex-1">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
                <p className="text-sm text-gray-600">Items Listed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{swapHistory.length}</p>
                <p className="text-sm text-gray-600">Swaps Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{pointsHistory.length}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-sm">
            <TabsTrigger value="listings" className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Package className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="swaps" className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              <RefreshCw className="h-4 w-4" />
              Swap History
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <TrendingUp className="h-4 w-4" />
              Points History
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Package className="h-5 w-5 text-blue-600" />
                  My Listings
                </CardTitle>
                <CardDescription>
                  Manage your clothing items and track their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first clothing item to the community</p>
                    <Button 
                      onClick={() => navigate('/add-listing')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Listing
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                        {listing.image_url && (
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={listing.image_url}
                              alt={listing.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">{listing.title}</h3>
                            <Badge className={`${listingService.getStatusColor(listing.status)} text-xs`}>
                              {listingService.getStatusText(listing.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {listing.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span className="bg-gray-100 px-2 py-1 rounded-full">{listing.category}</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Coins className="h-3 w-3" />
                              {listing.points}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/item/${listing.id}`)}
                              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteListing(listing.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swap History Tab */}
          <TabsContent value="swaps" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  Swap History
                </CardTitle>
                <CardDescription>
                  Track your clothing exchanges and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {swapHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps yet</h3>
                    <p className="text-gray-600">Start swapping clothes to see your history here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {swapHistory.map((swap) => (
                      <Card key={swap.id} className="p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border-0 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                              <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{swap.item_title}</h4>
                              <p className="text-sm text-gray-600">
                                {swap.sender_name} → {swap.receiver_name}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(swap.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(swap.status)}
                              <Badge className={`${listingService.getStatusColor(swap.status)} text-xs`}>
                                {listingService.getStatusText(swap.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Points History Tab */}
          <TabsContent value="points" className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Points History
                </CardTitle>
                <CardDescription>
                  Track your points earnings and spending over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pointsHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No points history</h3>
                    <p className="text-gray-600">Start earning points by creating listings and swapping clothes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pointsHistory.map((point) => (
                      <Card key={point.id} className="p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border-0 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {point.action.replace(/_/g, ' ')}
                            </h4>
                            <p className="text-sm text-gray-600">{point.description}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(point.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${point.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {point.points > 0 ? '+' : ''}{point.points}
                            </p>
                            <p className="text-xs text-gray-500">Points</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard