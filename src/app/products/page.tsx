import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

// 临时模拟数据
const products = [
  { id: "1", name: "经典白色T恤", price: 99, originalPrice: 159, category: "上衣", badge: "热销" },
  { id: "2", name: "牛仔休闲裤", price: 299, originalPrice: 399, category: "裤子", badge: "新品" },
  { id: "3", name: "运动鞋", price: 499, originalPrice: 699, category: "鞋子", badge: "限时折扣" },
  { id: "4", name: "双肩背包", price: 199, originalPrice: 299, category: "配饰", badge: null },
  { id: "5", name: "棉质衬衫", price: 189, originalPrice: 259, category: "上衣", badge: null },
  { id: "6", name: "休闲短裤", price: 149, originalPrice: 199, category: "裤子", badge: "热销" },
  { id: "7", name: "帆布鞋", price: 259, originalPrice: 359, category: "鞋子", badge: null },
  { id: "8", name: "棒球帽", price: 69, originalPrice: 99, category: "配饰", badge: "新品" },
]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">全部商品</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">全部商品</h1>
          <p className="text-muted-foreground mt-1">共 {products.length} 件商品</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">最新上架</SelectItem>
              <SelectItem value="price-asc">价格从低到高</SelectItem>
              <SelectItem value="price-desc">价格从高到低</SelectItem>
              <SelectItem value="popular">最受欢迎</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm">全部</Button>
        <Button variant="ghost" size="sm">上衣</Button>
        <Button variant="ghost" size="sm">裤子</Button>
        <Button variant="ghost" size="sm">鞋子</Button>
        <Button variant="ghost" size="sm">配饰</Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="aspect-square bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  商品图片
                </div>
                {product.badge && (
                  <Badge className="absolute top-2 left-2">
                    {product.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
              <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg font-bold text-primary">¥{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">¥{product.originalPrice}</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" asChild>
                <Link href={`/products/${product.id}`}>查看详情</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            ←
          </Button>
          <Button variant="default" size="icon">1</Button>
          <Button variant="outline" size="icon">2</Button>
          <Button variant="outline" size="icon">3</Button>
          <Button variant="outline" size="icon">
            →
          </Button>
        </div>
      </div>
    </div>
  )
}
