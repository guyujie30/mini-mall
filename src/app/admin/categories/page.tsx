import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminCategoriesPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加分类
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">分类名称</th>
                <th className="text-left p-4 font-medium">Slug</th>
                <th className="text-left p-4 font-medium">描述</th>
                <th className="text-right p-4 font-medium">商品数</th>
                <th className="text-right p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-0">
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">{category.slug}</td>
                  <td className="p-4 text-muted-foreground">{category.description || "-"}</td>
                  <td className="p-4 text-right">{category._count.products}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
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
