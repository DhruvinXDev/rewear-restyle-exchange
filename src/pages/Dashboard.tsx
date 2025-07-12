import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit3, Plus, Package, History, Star, Clock, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "@/components/common/Header"
import ProductCard from "@/components/common/ProductCard"
import product1 from "@/assets/product-1.jpg"
import product2 from "@/assets/product-2.jpg"
import product3 from "@/assets/product-3.jpg"

const Dashboard = () => {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    points: 85,
    avatar: "",
    joinDate: "March 2024",
    totalSwaps: 12,
    totalListings: 8
  })

  const myListings = [
    {
      id: "1",
      image: product1,
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition.",
      category: "Jackets",
      size: "M",
      condition: "Excellent",
      points: 25,
      isAvailable: true,
      status: "active",
      views: 24,
      likes: 5
    },
    {
      id: "2",
      image: product2,
      title: "Floral Summer Dress",
      description: "Beautiful floral pattern dress, ideal for summer.",
      category: "Dresses",
      size: "S",
      condition: "Good",
      points: 20,
      isAvailable: false,
      status: "swapped",
      views: 18,
      likes: 3
    }
  ]

  const mySwaps = [
    {
      id: "s1",
      item: {
        id: "3",
        image: product3,
        title: "Cozy Knit Sweater",
        description: "Warm and comfortable knit sweater in earth tones.",
        category: "Sweaters",
        size: "L",
        condition: "Excellent",
        points: 22
      },
      swapDate: "2024-01-15",
      status: "completed",
      swappedWith: "Sarah Chen"
    },
    {
      id: "s2",
      item: {
        id: "4",
        image: product1,
        title: "Professional Blazer",
        description: "Modern blazer perfect for work.",
        category: "Blazers",
        size: "M",
        condition: "Like New",
        points: 30
      },
      swapDate: "2024-01-10",
      status: "pending",
      swappedWith: "Maria Garcia"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success">Active</Badge>
      case "swapped":
        return <Badge className="bg-info/20 text-info">Swapped</Badge>
      case "completed":
        return <Badge className="bg-success/20 text-success">Completed</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Overview */}
        <div className="glass-card p-6 mb-8 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">Member since {user.joinDate}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{user.points}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{user.totalSwaps}</div>
                <div className="text-sm text-muted-foreground">Swaps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{user.totalListings}</div>
                <div className="text-sm text-muted-foreground">Listings</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Link to="/add-item">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="swaps" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              My Swaps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Your Listed Items</h2>
                <Link to="/add-item">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Item
                  </Button>
                </Link>
              </div>

              {myListings.length === 0 ? (
                <div className="text-center py-12 animate-fadeInUp">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No items listed yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first item to the marketplace</p>
                  <Link to="/add-item">
                    <Button>Add Your First Item</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard {...item} />
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {item.likes} likes
                        </span>
                        <span>{item.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="swaps" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Your Swap History</h2>

              {mySwaps.length === 0 ? (
                <div className="text-center py-12 animate-fadeInUp">
                  <History className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No swaps yet</h3>
                  <p className="text-muted-foreground mb-4">Browse items and make your first swap</p>
                  <Link to="/browse">
                    <Button>Browse Items</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySwaps.map((swap, index) => (
                    <div
                      key={swap.id}
                      className="glass-card p-6 animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={swap.item.image}
                            alt={swap.item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{swap.item.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Swapped with {swap.swappedWith}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(swap.swapDate).toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(swap.status)}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span>Size: {swap.item.size}</span>
                            <span>Condition: {swap.item.condition}</span>
                            <span className="text-primary font-medium">{swap.item.points} points</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {swap.status === "completed" && (
                            <CheckCircle className="w-6 h-6 text-success" />
                          )}
                          {swap.status === "pending" && (
                            <Clock className="w-6 h-6 text-warning" />
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard