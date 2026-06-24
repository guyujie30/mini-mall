"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
} from "lucide-react"
import { toast } from "sonner"

interface OrderDetail {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  memberLevel: number | null
  createdAt: string
  paidAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  items: {
    id: string
    quantity: number
    price: number
    subtotal: number
    product: {
      name: string
    }
  }[]
  address: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
  }
}

const statusLabels: Record<string, string> = {
  PENDING: "待付款",
  PAID: "已付款",
  SHIPPED: "已发货",
  DELIVERED: "已收货",
  CANCELLED: "已取消",
  REFUNDED: "已退款",
}

type StatusVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"

const statusColors: Record<string, StatusVariant> = {
  PENDING: "outline",
  PAID: "default",
  SHIPPED: "default",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handlePay = async () => {
    if (!order) return

    try {
      const response = await fetch("/api/mock-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "支付失败")
        return
      }

      toast.success("支付成功！")
      router.push("/payment/success")
    } catch {
      toast.error("支付失败")
    }
  }

  if (loading) {
    return <div className="container mx-auto py-16 text-center">加载中...</div>
  }

  if (!order) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-muted-foreground mb-4">订单不存在</p>
        <Link href="/account/orders" className={buttonVariants()}>返回订单列表</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/account/orders"
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">订单详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  订单信息
                </CardTitle>
                <Badge variant={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">订单号</span>
                <span className="font-mono">{order.orderNo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">下单时间</span>
                <span>{new Date(order.createdAt).toLocaleString("zh-CN")}</span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">付款时间</span>
                  <span>{new Date(order.paidAt).toLocaleString("zh-CN")}</span>
                </div>
              )}
              {order.memberLevel && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">会员等级</span>
                  <span>等级 {order.memberLevel}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>商品清单</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">
                      {item.product.name}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      x{item.quantity}
                    </span>
                  </div>
                  <span>¥{item.subtotal}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                收货地址
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">
                {order.address.name} {order.address.phone}
              </div>
              <div className="text-sm text-muted-foreground">
                {order.address.province} {order.address.city} {order.address.district} {order.address.detail}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>订单摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">商品总额</span>
                <span>¥{order.totalAmount.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>会员折扣</span>
                  <span>-¥{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>实付金额</span>
                <span className="text-primary">
                  ¥{order.finalAmount.toFixed(2)}
                </span>
              </div>

              {order.status === "PENDING" && (
                <Button className="w-full" size="lg" onClick={handlePay}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  去支付
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
