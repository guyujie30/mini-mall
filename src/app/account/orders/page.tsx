import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Eye } from "lucide-react"

// 临时模拟数据
const orders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "已发货",
    total: 398,
    items: [
      { name: "经典白色T恤", quantity: 2, price: 99 },
      { name: "牛仔休闲裤", quantity: 1, price: 299 },
    ],
  },
  {
    id: "ORD002",
    date: "2024-01-10",
    status: "已完成",
    total: 599,
    items: [
      { name: "运动鞋", quantity: 1, price: 499 },
      { name: "棒球帽", quantity: 1, price: 69 },
    ],
  },
  {
    id: "ORD003",
    date: "2024-01-05",
    status: "已完成",
    total: 299,
    items: [
      { name: "牛仔休闲裤", quantity: 1, price: 299 },
    ],
  },
  {
    id: "ORD004",
    date: "2024-01-01",
    status: "已取消",
    total: 199,
    items: [
      { name: "双肩背包", quantity: 1, price: 199 },
    ],
  },
]

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "待付款": "outline",
  "待发货": "secondary",
  "已发货": "default",
  "已完成": "secondary",
  "已取消": "destructive",
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
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
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">{order.id}</span>
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </div>
                  <Badge variant={statusColors[order.status] || "secondary"}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded flex-shrink-0">
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                            图片
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">¥{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-muted-foreground">
                      共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lg">
                        合计: <span className="text-primary">¥{order.total}</span>
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看详情
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
