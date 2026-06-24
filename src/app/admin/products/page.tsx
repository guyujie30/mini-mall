import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminProductsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            添加商品
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">商品名称</th>
                <th className="text-left p-4 font-medium">分类</th>
                <th className="text-right p-4 font-medium">价格</th>
                <th className="text-right p-4 font-medium">库存</th>
                <th className="text-center p-4 font-medium">状态</th>
                <th className="text-right p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-muted-foreground">{product.category.name}</td>
                  <td className="p-4 text-right">¥{product.price}</td>
                  <td className="p-4 text-right">
                    <span className={product.stock < 10 ? "text-destructive" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "上架" : "下架"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
