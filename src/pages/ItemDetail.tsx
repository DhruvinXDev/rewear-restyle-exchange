import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Eye, 
  ArrowLeft,
  Star,
  MessageCircle,
  Shield
} from "lucide-react"
import Header from "@/components/common/Header"
import ProductCard from "@/components/common/ProductCard"
import product1 from "@/assets/product-1.jpg"
import product2 from "@/assets/product-2.jpg"
import product3 from "@/assets/product-3.jpg"
import product4 from "@/assets/product-4.jpg"

const ItemDetail = () => {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  // Mock data - would come from API based on id
  const item = {
    id: "1",
    title: "Vintage Denim Jacket",
    description: "This beautiful vintage denim jacket is a timeless piece that never goes out of style. Made from high-quality denim with a classic fit, it features authentic wear patterns that give it character and charm. Perfect for layering over t-shirts or dresses, this jacket will be a versatile addition to any wardrobe.\n\nThe jacket has been well-maintained and shows minimal signs of wear. All buttons and zippers are fully functional. It's been stored in a smoke-free environment and is ready for its next adventure.",
    images: [product1, product2, product3, product4],
    category: "Jackets",
    size: "M",
    condition: "Excellent",
    points: 25,
    isAvailable: true,
    brand: "Levi's",
    color: "Blue",
    material: "100% Cotton Denim",
    measurements: {
      chest: "42 inches",
      length: "24 inches",
      sleeve: "23 inches"
    },
    tags: ["vintage", "denim", "classic", "unisex"],
    views: 124,
    likes: 18,
    postedDate: "2024-01-10",
    seller: {
      id: "u1",
      name: "Sarah Chen",
      avatar: "",
      rating: 4.8,
      swapsCompleted: 23,
      responseRate: "98%",
      lastActive: "2 hours ago"
    }
  }

  const relatedItems = [
    {
      id: "2",
      image: product2,
      title: "Floral Summer Dress",
      description: "Beautiful floral pattern dress, ideal for summer occasions.",
      category: "Dresses",
      size: "S",
      condition: "Good",
      points: 20
    },
    {
      id: "3",
      image: product3,
      title: "Cozy Knit Sweater",
      description: "Warm and comfortable knit sweater in earth tones.",
      category: "Sweaters",
      size: "L",
      condition: "Excellent",
      points: 22
    },
    {
      id: "4",
      image: product4,
      title: "Professional Blazer",
      description: "Modern blazer made from sustainable materials.",
      category: "Blazers",
      size: "M",
      condition: "Like New",
      points: 30
    }
  ]

  const handleSwapRequest = () => {
    // Handle swap request logic
    console.log("Swap request for item:", id)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    navigator.share?.({ 
      title: item.title, 
      url: window.location.href 
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground smooth-transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 smooth-transition ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{item.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {item.likes} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-success/20 text-success">
                  {item.isAvailable ? 'Available' : 'Swapped'}
                </Badge>
                <span className="text-2xl font-bold text-primary">{item.points} points</span>
              </div>
            </div>

            {/* Item Specifications */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
              <div>
                <span className="text-sm text-muted-foreground">Size</span>
                <p className="font-medium">{item.size}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Condition</span>
                <p className="font-medium">{item.condition}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Brand</span>
                <p className="font-medium">{item.brand}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Color</span>
                <p className="font-medium">{item.color}</p>
              </div>
            </div>

            {/* Measurements */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Measurements</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Chest</span>
                  <p className="font-medium">{item.measurements.chest}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Length</span>
                  <p className="font-medium">{item.measurements.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sleeve</span>
                  <p className="font-medium">{item.measurements.sleeve}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleSwapRequest} 
                className="w-full h-12"
                disabled={!item.isAvailable}
              >
                {item.isAvailable ? 'Request Swap' : 'Item Not Available'}
              </Button>
              <Button variant="outline" className="w-full h-12">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Seller
              </Button>
            </div>

            {/* Seller Info */}
            <div className="p-4 border border-border rounded-xl">
              <h3 className="font-semibold text-foreground mb-3">Seller Information</h3>
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={item.seller.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {item.seller.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.seller.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      {item.seller.rating} ({item.seller.swapsCompleted} swaps)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-success">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Verified</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Response Rate</span>
                  <p className="font-medium">{item.seller.responseRate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Active</span>
                  <p className="font-medium">{item.seller.lastActive}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {item.description}
            </p>
          </div>
          
          {/* Tags */}
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Similar Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((relatedItem, index) => (
              <div
                key={relatedItem.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...relatedItem} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail