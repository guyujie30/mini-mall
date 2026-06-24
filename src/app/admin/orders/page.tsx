import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  PAID: "default",
  SHIPPED: "default",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
}

const statusLabels: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已收货",
  CANCELLED: "已取消",
  REFUNDED: "已退款",
}

export default async function AdminOrdersPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">订单号</th>
                <th className="text-left p-4 font-medium">用户</th>
                <th className="text-center p-4 font-medium">商品数</th>
                <th className="text-right p-4 font-medium">金额</th>
                <th className="text-center p-4 font-medium">状态</th>
                <th className="text-left p-4 font-medium">下单时间</th>
                <th className="text-right p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="p-4 font-mono text-sm">{order.orderNo}</td>
                  <td className="p-4">{order.user.name || order.user.email}</td>
                  <td className="p-4 text-center">{order.items.length}</td>
                  <td className="p-4 text-right font-medium">¥{order.finalAmount}</td>
                  <td className="p-4 text-center">
                    <Badge variant={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/orders/${order.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                      <Eye className="h-4 w-4" />
                    </Link>
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
