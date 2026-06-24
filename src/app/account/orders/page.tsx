import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Eye } from "lucide-react"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline", PAID: "default", SHIPPED: "default",
  DELIVERED: "secondary", CANCELLED: "destructive", REFUNDED: "destructive",
}

const statusLabels: Record<string, string> = {
  PENDING: "待付款", PAID: "已付款", SHIPPED: "已发货",
  DELIVERED: "已收货", CANCELLED: "已取消", REFUNDED: "已退款",
}

export default async function OrdersPage() {
  let user
  try {
    user = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/account" className="hover:text-foreground">我的账户</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">我的订单</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">我的订单</h1>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待付款</TabsTrigger>
          <TabsTrigger value="shipped">待收货</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">暂无订单</p>
            </div>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">{order.orderNo}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    <Badge variant={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="font-medium">¥{item.subtotal}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-muted-foreground">
                        共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
                      </span>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-lg">
                          合计: <span className="text-primary">¥{order.finalAmount}</span>
                        </span>
                        <Link href={`/account/orders/${order.id}`} className={buttonVariants({ size: "sm" })}>
                          <Eye className="mr-2 h-4 w-4" />查看详情
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pending">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无待付款订单</p>
          </div>
        </TabsContent>

        <TabsContent value="shipped">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无待收货订单</p>
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无已完成订单</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
