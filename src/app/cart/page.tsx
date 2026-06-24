"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    stock: number
    images: string
  }
}

export default function CartPage() {
  const { data: session } = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "更新失败")
        return
      }

      setCartItems((items) =>
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch {
      toast.error("更新失败")
    }
  }

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        toast.error("删除失败")
        return
      }

      setCartItems((items) => items.filter((item) => item.id !== id))
      toast.success("已从购物车移除")
    } catch {
      toast.error("删除失败")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        加载中...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">请先登录</h1>
          <p className="text-muted-foreground">登录后查看购物车</p>
          <Link href="/auth/login" className={buttonVariants()}>去登录</Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">购物车是空的</h1>
          <p className="text-muted-foreground">快去挑选你喜欢的商品吧！</p>
          <Link href="/products" className={buttonVariants()}>去购物</Link>
        </div>
      </div>
    )
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal >= 99 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">购物车</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">购物车</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    {item.product.images &&
                    item.product.images !== "[]" ? (
                      <img
                        src={
                          JSON.parse(
                            item.product.images
                          )[0] || "/placeholder.png"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                        暂无图片
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-primary">
                        ¥{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>订单摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">商品小计</span>
                <span>¥{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">运费</span>
                <span>{shipping === 0 ? "免运费" : `¥${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  满 ¥99 免运费，还差 ¥{99 - subtotal}
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>总计</span>
                <span className="text-primary">¥{total}</span>
              </div>
              <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full" })}>
                去结算
              </Link>
              <Link href="/products" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                继续购物
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
