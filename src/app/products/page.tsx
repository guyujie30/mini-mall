import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: categorySlug } = await searchParams

  // 获取所有分类
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  // 获取当前分类
  const currentCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : null

  // 获取商品
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug && { category: { slug: categorySlug } }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">
          {currentCategory ? currentCategory.name : "全部商品"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          {currentCategory ? currentCategory.name : "全部商品"}
        </h1>
        <p className="text-muted-foreground mt-1">共 {products.length} 件商品</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/products"
          className={buttonVariants({
            variant: !categorySlug ? "default" : "outline",
            size: "sm",
          })}
        >
          全部
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={buttonVariants({
              variant: categorySlug === category.slug ? "default" : "outline",
              size: "sm",
            })}
          >
            {category.name}
            <span className="ml-1 text-xs opacity-70">({category._count.products})</span>
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">暂无商品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
                  <span className="text-lg font-bold text-primary">¥{product.price}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/products/${product.id}`} className={buttonVariants({ className: "w-full" })}>
                  查看详情
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
