import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid, List } from "lucide-react"
import Header from "@/components/common/Header"
import ProductCard from "@/components/common/ProductCard"
import product1 from "@/assets/product-1.jpg"
import product2 from "@/assets/product-2.jpg"
import product3 from "@/assets/product-3.jpg"
import product4 from "@/assets/product-4.jpg"

const Browse = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Mock data - would come from API
  const items = [
    {
      id: "1",
      image: product1,
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition. Perfect for casual outings and weekend adventures.",
      category: "Jackets",
      size: "M",
      condition: "Excellent",
      points: 25,
      isAvailable: true
    },
    {
      id: "2",
      image: product2,
      title: "Floral Summer Dress",
      description: "Beautiful floral pattern dress, ideal for summer occasions and garden parties.",
      category: "Dresses",
      size: "S",
      condition: "Good",
      points: 20,
      isAvailable: true
    },
    {
      id: "3",
      image: product3,
      title: "Cozy Knit Sweater",
      description: "Warm and comfortable knit sweater in earth tones, perfect for chilly evenings.",
      category: "Sweaters",
      size: "L",
      condition: "Excellent",
      points: 22,
      isAvailable: false
    },
    {
      id: "4",
      image: product4,
      title: "Professional Blazer",
      description: "Modern blazer made from sustainable materials, perfect for work and formal events.",
      category: "Blazers",
      size: "M",
      condition: "Like New",
      points: 30,
      isAvailable: true
    },
    // Duplicate items for demo
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `${i + 5}`,
      image: [product1, product2, product3, product4][i % 4],
      title: ["Vintage Denim Jacket", "Floral Summer Dress", "Cozy Knit Sweater", "Professional Blazer"][i % 4],
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      category: ["Jackets", "Dresses", "Sweaters", "Blazers"][i % 4],
      size: ["S", "M", "L", "XL"][i % 4],
      condition: ["Good", "Excellent", "Like New"][i % 3],
      points: 15 + (i * 3),
      isAvailable: i % 3 !== 0
    }))
  ]

  const categories = ["all", "Jackets", "Dresses", "Sweaters", "Blazers", "Pants", "Accessories"]
  const sizes = ["all", "XS", "S", "M", "L", "XL", "XXL"]
  const conditions = ["all", "Like New", "Excellent", "Good", "Fair"]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse Items
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover amazing pieces from our sustainable fashion community
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 space-y-4 lg:space-y-0">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>
                    {size === "all" ? "All Sizes" : size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map(condition => (
                  <SelectItem key={condition} value={condition}>
                    {condition === "all" ? "All Conditions" : condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="points-low">Points: Low to High</SelectItem>
                <SelectItem value="points-high">Points: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredItems.length} items
          </p>
          <div className="text-sm text-muted-foreground">
            {filteredItems.filter(item => item.isAvailable).length} available for swap
          </div>
        </div>

        {/* Items Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard
                {...item}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Items
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Browse