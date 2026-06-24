import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShoppingBag, Star, Truck } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  // 从数据库获取推荐商品
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  // 获取分类
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              发现你的风格
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              精选优质商品，简约而不简单。会员专享折扣，越买越省。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  立即选购
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900" asChild>
                <Link href="/member">
                  了解会员
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">免费配送</h3>
                <p className="text-sm text-muted-foreground">满99元免运费</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">品质保证</h3>
                <p className="text-sm text-muted-foreground">精选优质商品</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">会员专享</h3>
                <p className="text-sm text-muted-foreground">最高可达85折</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">商品分类</h2>
            <Button variant="ghost" asChild>
              <Link href="/products">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category._count.products} 件商品
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">精选商品</h2>
            <Button variant="ghost" asChild>
              <Link href="/products">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      商品图片
                    </div>
                    {product.isFeatured && (
                      <Badge className="absolute top-2 left-2">推荐</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
                  <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                      ¥{product.price}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" asChild>
                    <Link href={`/products/${product.id}`}>
                      查看详情
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Member CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                成为会员，享受更多优惠
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                注册即享会员专属折扣，消费越多等级越高，优惠越多！
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">
                    立即注册
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link href="/member">
                    了解更多
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
