import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Package, MapPin, LogOut, Crown } from "lucide-react"

export default async function AccountPage() {
  let user
  try {
    user = await requireAuth()
  } catch {
    redirect("/auth/login")
  }

  // 获取用户完整信息
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      member: true,
      _count: {
        select: {
          orders: true,
          addresses: true,
        },
      },
    },
  })

  if (!userData) {
    redirect("/auth/login")
  }

  // 获取最近订单
  const recentOrders = await prisma.order.findMany({
    where: { userId: user.id },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  // 计算下一个会员等级
  const nextMember = userData.member
    ? await prisma.member.findFirst({
        where: { level: userData.member.level + 1 },
      })
    : await prisma.member.findFirst({ where: { level: 2 } })

  // 计算累计消费
  const totalSpent = await prisma.order.aggregate({
    _sum: { finalAmount: true },
    where: {
      userId: user.id,
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
  })

  const spent = totalSpent._sum.finalAmount || 0

  const statusLabels: Record<string, string> = {
    PENDING: "待付款",
    PAID: "已付款",
    SHIPPED: "已发货",
    DELIVERED: "已收货",
    CANCELLED: "已取消",
    REFUNDED: "已退款",
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">个人中心</h1>

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
                  <h3 className="font-semibold">{userData.name || "用户"}</h3>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <nav className="space-y-1">
            <Button variant="secondary" className="w-full justify-start" asChild>
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
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" asChild>
              <Link href="/api/auth/signout">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Link>
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
                  <Badge className="bg-white/20 text-white mb-2">
                    {userData.member?.name || "普通用户"}
                  </Badge>
                  <h2 className="text-2xl font-bold">{userData.name || "用户"}</h2>
                  {userData.member && (
                    <p className="text-sm opacity-90 mt-1">
                      专享 {(userData.member.discount * 10).toFixed(0)} 折优惠
                    </p>
                  )}
                </div>
                <Crown className="h-8 w-8 opacity-80" />
              </div>
              {nextMember && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>累计消费: ¥{spent}</span>
                    <span>升级还需: ¥{Math.max(0, nextMember.minAmount - spent)}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all"
                      style={{
                        width: `${Math.min(100, (spent / nextMember.minAmount) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs opacity-75 mt-2">
                    距离{nextMember.name}还需消费 ¥{Math.max(0, nextMember.minAmount - spent)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">{userData._count.orders}</p>
                <p className="text-sm text-muted-foreground">总订单数</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">{userData._count.addresses}</p>
                <p className="text-sm text-muted-foreground">收货地址</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-2xl font-bold text-primary">¥{spent}</p>
                <p className="text-sm text-muted-foreground">累计消费</p>
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
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">暂无订单</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNo}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.status === "PENDING" ? "outline" : "secondary"}>
                          {statusLabels[order.status]}
                        </Badge>
                        <p className="font-medium mt-1">¥{order.finalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
