import { Button } from "@/components/ui/button"
import { Heart, Eye, Users } from "lucide-react"
import { Link } from "react-router-dom"

interface ProductCardProps {
  id: string
  image: string
  title: string
  description: string
  category: string
  size: string
  condition: string
  points?: number
  isAvailable?: boolean
  className?: string
}

const ProductCard = ({
  id,
  image,
  title,
  description,
  category,
  size,
  condition,
  points,
  isAvailable = true,
  className = ""
}: ProductCardProps) => {
  return (
    <div className={`product-card group cursor-pointer ${className}`}>
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 smooth-transition"
        />
        <div className="absolute top-3 right-3 space-y-2">
          <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white smooth-transition shadow-soft">
            <Heart className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isAvailable 
              ? 'bg-success/20 text-success' 
              : 'bg-muted/80 text-muted-foreground'
          }`}>
            {isAvailable ? 'Available' : 'Swapped'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary smooth-transition">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="bg-secondary/50 px-2 py-1 rounded-md">{category}</span>
          <span>Size: {size}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Condition: {condition}</span>
          {points && (
            <span className="text-primary font-medium">{points} points</span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link to={`/item/${id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          {isAvailable && (
            <Button size="sm" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Swap
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard