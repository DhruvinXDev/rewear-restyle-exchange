import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { listingService } from '@/services/listingService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Package, 
  DollarSign, 
  FileText, 
  Tag,
  Home,
  Plus,
  ArrowLeft
} from 'lucide-react'

const AddListing = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    points: '',
    image: null as File | null
  })

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Other'
  ]

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
  ]

  const conditions = [
    'New', 'Like New', 'Good', 'Fair', 'Poor'
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category || !formData.points) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (!formData.image) {
      toast({
        title: "Image Required",
        description: "Please upload an image for your listing",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const listingData = {
        ...formData,
        points: parseInt(formData.points) || 0
      }
      const success = await listingService.createListing(listingData)
      
      if (success) {
        toast({
          title: "Success!",
          description: "Your listing has been created successfully"
        })
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: "Failed to create listing. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Listing</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Create New Listing</CardTitle>
              <CardDescription className="text-gray-600">
                Share your clothing items with the community and earn points
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Upload className="h-4 w-4" />
                    Item Image *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-200"
                          />
                          <p className="text-sm text-gray-600">Click to change image</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium">Upload an image</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Package className="h-4 w-4" />
                    Item Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Vintage Denim Jacket"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2 text-gray-700 font-medium">
                    <FileText className="h-4 w-4" />
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your item, including brand, material, and any notable features..."
                    rows={4}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Category and Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Tag className="h-4 w-4" />
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Package className="h-4 w-4" />
                      Size
                    </Label>
                    <Select value={formData.size} onValueChange={(value) => handleInputChange('size', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Condition and Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition" className="flex items-center gap-2 text-gray-700 font-medium">
                      <Package className="h-4 w-4" />
                      Condition
                    </Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points" className="flex items-center gap-2 text-gray-700 font-medium">
                      <DollarSign className="h-4 w-4" />
                      Points Value *
                    </Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => handleInputChange('points', e.target.value)}
                      placeholder="Enter points value"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">How many points is this item worth?</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Listing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create Listing
                      </div>
                    )}
                  </Button>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Tips for a great listing:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Take clear, well-lit photos of your item</li>
                    <li>• Be honest about the condition and any flaws</li>
                    <li>• Include brand names and materials when possible</li>
                    <li>• Set reasonable points values based on item quality</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddListing 