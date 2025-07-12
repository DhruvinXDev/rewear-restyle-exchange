import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Recycle, Shirt, Sparkles, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "@/components/common/Header"
import ProductCard from "@/components/common/ProductCard"
import heroImage from "@/assets/hero-image.jpg"
import product1 from "@/assets/product-1.jpg"
import product2 from "@/assets/product-2.jpg"
import product3 from "@/assets/product-3.jpg"
import product4 from "@/assets/product-4.jpg"

const Home = () => {
  const featuredItems = [
    {
      id: "1",
      image: product1,
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition. Perfect for casual outings.",
      category: "Jackets",
      size: "M",
      condition: "Excellent",
      points: 25
    },
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
      description: "Modern blazer made from sustainable materials, perfect for work.",
      category: "Blazers",
      size: "M",
      condition: "Like New",
      points: 30
    }
  ]

  const categories = [
    { name: "Shirts", icon: Shirt, count: 120 },
    { name: "Dresses", icon: Sparkles, count: 85 },
    { name: "Jackets", icon: Shirt, count: 95 },
    { name: "Pants", icon: Shirt, count: 110 },
    { name: "Accessories", icon: Sparkles, count: 75 },
    { name: "Shoes", icon: Shirt, count: 60 }
  ]

  const stats = [
    { icon: Users, label: "Happy Members", value: "500+" },
    { icon: Recycle, label: "Items Swapped", value: "1,200+" },
    { icon: TrendingUp, label: "CO2 Saved", value: "2.5 tons" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Sustainable Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeInUp">
              Swap, Share, <span className="text-accent">Sustain</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fadeInUp [animation-delay:0.2s]">
              Join the community revolutionizing fashion through clothing exchange. 
              Give your clothes a second life and discover amazing pieces from others.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp [animation-delay:0.4s]">
              <Link to="/register">
                <Button variant="glass" size="hero" className="w-full sm:w-auto">
                  Start Swapping <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" size="hero" className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30">
                  Browse Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/browse?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="user-card text-center hover:scale-105 smooth-transition animate-fadeInUp"
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 smooth-transition">
                    <category.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Items
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover trending pieces from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...item} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button variant="outline" size="lg">
                View All Items <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact Together
            </h2>
            <p className="text-xl opacity-90">
              Making a difference, one swap at a time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <stat.icon className="w-10 h-10" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of fashion-conscious individuals making a positive impact
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="secondary" size="hero">
                Join ReWear Community
              </Button>
            </Link>
            <Link to="/add-item">
              <Button variant="outline" size="hero" className="border-white text-white hover:bg-white/20">
                List Your First Item
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home