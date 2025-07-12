import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { profileService, UserProfile, SwapHistory, PointsHistory } from "@/services/profileService"
import { User, Edit, LogOut, Award, History, Settings, Camera, Loader2 } from "lucide-react"

const Profile = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([])
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  })

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Fetch user profile
        const userProfile = await profileService.getUserProfile(user.id)
        
        if (userProfile) {
          setProfile(userProfile)
          setFormData({
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone || "",
            bio: userProfile.bio || ""
          })
        } else {
          // Create profile if it doesn't exist
          const newProfile = await profileService.createInitialProfile(user)
          if (newProfile) {
            setProfile(newProfile)
            setFormData({
              name: newProfile.name,
              email: newProfile.email,
              phone: newProfile.phone || "",
              bio: newProfile.bio || ""
            })
          }
        }

        // Fetch swap history
        const swaps = await profileService.getSwapHistory(user.id)
        setSwapHistory(swaps)

        // Fetch points history
        const points = await profileService.getPointsHistory(user.id)
        setPointsHistory(points)

      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user, toast])

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

  const handleSave = async () => {
    if (!user || !profile) return

    try {
      const updatedProfile = await profileService.updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio
      })

      if (updatedProfile) {
        setProfile(updatedProfile)
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!user) {
    navigate("/login")
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {profile?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">
                  {profile?.name || "User"}
                </CardTitle>
                <CardDescription>{profile?.email || user.email}</CardDescription>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{profile?.points || 0} points</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="points">Points</TabsTrigger>
                <TabsTrigger value="history">Swap History</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handleSave} className="flex-1">
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="points" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Points & Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">{profile?.points || 0}</div>
                      <p className="text-muted-foreground">Total Points Earned</p>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <h4 className="font-semibold">How to earn points:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-bold">+50</span>
                          </div>
                          <span className="text-sm">Complete a swap</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">+25</span>
                          </div>
                          <span className="text-sm">List an item</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-bold">+10</span>
                          </div>
                          <span className="text-sm">Refer a friend</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-600 font-bold">+5</span>
                          </div>
                          <span className="text-sm">Daily login</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <History className="w-5 h-5 mr-2" />
                      Swap History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {swapHistory.map((swap) => {
                        const isSender = swap.sender_id === user?.id
                        return (
                          <div
                            key={swap.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 smooth-transition"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                {isSender ? (
                                  <span className="text-primary font-bold">→</span>
                                ) : (
                                  <span className="text-green-600 font-bold">←</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{swap.item_title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {isSender 
                                    ? `To: ${swap.receiver_name}` 
                                    : `From: ${swap.sender_name}`
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={swap.status === "completed" ? "default" : "secondary"}
                              >
                                {swap.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(swap.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 