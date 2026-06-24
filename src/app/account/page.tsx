import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Package, MapPin, CreditCard, LogOut, Crown } from "lucide-react"

// 临时模拟数据
const user = {
  name: "张三",
  email: "zhangsan@example.com",
  memberLevel: 2,
  memberName: "银卡会员",
  totalSpent: 2580,
  nextLevelAmount: 5000,
  discount: "9折",
}

const recentOrders = [
  { id: "ORD001", date: "2024-01-15", status: "已发货", total: 398 },
  { id: "ORD002", date: "2024-01-10", status: "已完成", total: 599 },
  { id: "ORD003", date: "2024-01-05", status: "已完成", total: 299 },
]

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">我的账户</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/account">
                <User className="mr-2 h-4 w-4" />
                个人中心
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/account/orders">
                <Package className="mr-2 h-4 w-4" />
                我的订单
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/account/addresses">
                <MapPin className="mr-2 h-4 w-4" />
                收货地址
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/member">
                <Crown className="mr-2 h-4 w-4" />
                会员中心
              </Link>
            </Button>
            <Separator className="my-2" />
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Member Card */}
          <Card className="bg-gradient-to-r from-gray-800 to-gray-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-white/20 text-white mb-2">{user.memberName}</Badge>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-sm opacity-90 mt-1">专享 {user.discount} 优惠</p>
                </div>
                <Crown className="h-8 w-8 opacity-80" />
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>当前消费: ¥{user.totalSpent}</span>
                  <span>升级还需: ¥{user.nextLevelAmount - user.totalSpent}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${(user.totalSpent / user.nextLevelAmount) * 100}%` }}
                  />
                </div>
                <p className="text-xs opacity-75 mt-2">
                  距离金卡会员还需消费 ¥{user.nextLevelAmount - user.totalSpent}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">待处理订单</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-sm text-muted-foreground">已完成订单</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-sm text-muted-foreground">收藏商品</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>最近订单</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account/orders">查看全部</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={order.status === "已发货" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                      <p className="font-medium mt-1">¥{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
