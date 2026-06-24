import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react"

// 临时模拟数据
const product = {
  id: "1",
  name: "经典白色T恤",
  description: "100%纯棉材质，舒适透气。经典圆领设计，简约百搭。适合日常穿着，多种颜色可选。",
  price: 99,
  originalPrice: 159,
  images: ["/images/tshirt-1.jpg", "/images/tshirt-2.jpg", "/images/tshirt-3.jpg"],
  category: "上衣",
  stock: 50,
  rating: 4.8,
  reviews: 128,
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["白色", "黑色", "灰色", "蓝色"],
  badge: "热销",
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-foreground">全部商品</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-lg">
              商品主图
            </div>
            {product.badge && (
              <Badge className="absolute top-4 left-4">{product.badge}</Badge>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg cursor-pointer hover:ring-2 hover:ring-primary">
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  图片 {i}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">{product.reviews} 条评价</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary">¥{product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">¥{product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <Badge variant="destructive">
                省 ¥{product.originalPrice - product.price}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Size Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">尺码</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button key={size} variant="outline" className="w-16">
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">颜色</label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button key={color} variant="outline">
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-sm font-medium">数量</label>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">1</span>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                库存: {product.stock} 件
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              加入购物车
            </Button>
            <Button size="lg" variant="secondary" className="flex-1">
              立即购买
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
              <Truck className="h-5 w-5 mb-1" />
              <span className="text-xs">包邮</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
              <Shield className="h-5 w-5 mb-1" />
              <span className="text-xs">正品保证</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-muted rounded-lg">
              <RotateCcw className="h-5 w-5 mb-1" />
              <span className="text-xs">7天退换</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
