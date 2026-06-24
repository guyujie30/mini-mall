"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Package } from "lucide-react"
import { toast } from "sonner"

interface OrderDetail {
  id: string
  orderNo: string
  status: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  createdAt: string
  paidAt: string | null
  shippedAt: string | null
  deliveredAt: string | null
  user: {
    name: string
    email: string
  }
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

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PAID: "default",
  SHIPPED: "default",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
}

const validTransitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleStatusUpdate = async (
    newStatus: string | null
  ) => {
    if (!newStatus) return
    if (!order) return
    setUpdating(true)

    try {
      const response = await fetch(
        `/api/orders/${order.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "更新失败")
        return
      }

      setOrder(data)
      toast.success("订单状态已更新")
    } catch {
      toast.error("更新失败")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">加载中...</div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          订单不存在
        </p>
        <Link
          href="/admin/orders"
          className={buttonVariants()}
        >
          返回订单列表
        </Link>
      </div>
    )
  }

  const availableTransitions =
    validTransitions[order.status] || []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/orders"
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">订单详情</h1>
        <Badge variant={statusColors[order.status]}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                订单信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  订单号
                </span>
                <span className="font-mono">
                  {order.orderNo}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  下单时间
                </span>
                <span>
                  {new Date(
                    order.createdAt
                  ).toLocaleString("zh-CN")}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    付款时间
                  </span>
                  <span>
                    {new Date(
                      order.paidAt
                    ).toLocaleString("zh-CN")}
                  </span>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    发货时间
                  </span>
                  <span>
                    {new Date(
                      order.shippedAt
                    ).toLocaleString("zh-CN")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>客户信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">
                  姓名：
                </span>
                {order.user.name || "未设置"}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">
                  邮箱：
                </span>
                {order.user.email}
              </div>
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
                  <span>¥{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>收货地址</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-medium">
                {order.address.name} {order.address.phone}
              </div>
              <div className="text-sm text-muted-foreground">
                {order.address.province}
                {order.address.city}
                {order.address.district}
                {order.address.detail}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>订单金额</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  商品总额
                </span>
                <span>
                  ¥{order.totalAmount.toFixed(2)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>会员折扣</span>
                  <span>
                    -¥{order.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>实付金额</span>
                <span className="text-primary">
                  ¥{order.finalAmount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          {availableTransitions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>更新状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  onValueChange={handleStatusUpdate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择新状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTransitions.map(
                      (status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          {statusLabels[status]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {updating && (
                  <p className="text-sm text-muted-foreground">
                    更新中...
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
