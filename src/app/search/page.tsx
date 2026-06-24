import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { prisma } from "@/lib/prisma"
import { parseImages } from "@/lib/utils"
import { Search } from "lucide-react"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams

  let products: Array<{
    id: string
    name: string
    price: number
    images: string
    isFeatured: boolean
    category: { name: string }
  }> = []

  if (query) {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: { category: true },
      take: 20,
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">搜索商品</h1>

      {/* Search Form */}
      <form className="mb-8">
        <div className="flex gap-2">
          <Input
            name="q"
            placeholder="输入商品名称或关键词..."
            defaultValue={query}
            className="flex-1"
          />
          <button type="submit" className={buttonVariants()}>
            <Search className="mr-2 h-4 w-4" />
            搜索
          </button>
        </div>
      </form>

      {/* Results */}
      {query ? (
        <>
          <p className="text-muted-foreground mb-6">
            {products.length > 0
              ? `找到 ${products.length} 件相关商品`
              : `未找到与"${query}"相关的商品`}
          </p>

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images !== "[]" ? (
                        <img
                          src={parseImages(product.images)[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          暂无图片
                        </div>
                      )}
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
        </>
      ) : (
        <div className="text-center py-16">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">输入关键词搜索商品</p>
        </div>
      )}
    </div>
  )
}
