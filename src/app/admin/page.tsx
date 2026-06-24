import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
    }),
  ])

  const stats = [
    { title: "商品数量", value: productCount, icon: Package, color: "text-blue-500" },
    { title: "订单数量", value: orderCount, icon: ShoppingCart, color: "text-green-500" },
    { title: "用户数量", value: userCount, icon: Users, color: "text-purple-500" },
    { title: "总收入", value: `¥${totalRevenue._sum.finalAmount || 0}`, icon: DollarSign, color: "text-orange-500" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 最近订单 */}
      <h2 className="text-lg font-semibold mt-8 mb-4">最近订单</h2>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">订单号</th>
                <th className="text-left p-4 font-medium">状态</th>
                <th className="text-right p-4 font-medium">金额</th>
              </tr>
            </thead>
            <tbody>
              {(await prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
              })).map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="p-4">{order.orderNo}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium">¥{order.finalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
