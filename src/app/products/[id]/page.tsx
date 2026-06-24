import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, isActive: true },
    include: { category: true },
  })

  if (!product) {
    notFound()
  }

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
              商品图片
            </div>
            {product.isFeatured && (
              <Badge className="absolute top-4 left-4">推荐</Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category.name}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary">¥{product.price}</span>
          </div>

          <Separator />

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Stock */}
          <div className="text-sm text-muted-foreground">
            库存: {product.stock > 0 ? `${product.stock} 件` : "已售罄"}
          </div>

          {/* Actions */}
          <AddToCartButton productId={product.id} stock={product.stock} />

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
