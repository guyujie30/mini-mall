"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAddress, setSelectedAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/addresses").then((r) => r.json()),
      fetch("/api/cart").then((r) => r.json()),
    ]).then(([addrData, cartData]) => {
      setAddresses(addrData)
      setCartItems(cartData.items || [])
      const defaultAddr = addrData.find((a: Address) => a.isDefault)
      if (defaultAddr) setSelectedAddress(defaultAddr.id)
      setInitialLoading(false)
    })
  }, [])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = subtotal >= 99 ? 0 : 10
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("请选择收货地址")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "下单失败")
        return
      }

      toast.success("下单成功！")
      router.push(`/account/orders/${data.id}`)
    } catch {
      toast.error("下单失败")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="container mx-auto py-16 text-center">加载中...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">购物车为空</p>
        <Link href="/products" className={buttonVariants()}>去购物</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">结算</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* 地址选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                收货地址
              </CardTitle>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-2">暂无收货地址</p>
                  <Link href="/account/addresses" className={buttonVariants({ variant: "outline" })}>添加地址</Link>
                </div>
              ) : (
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                      <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{addr.name} {addr.phone}</div>
                        <div className="text-sm text-muted-foreground">
                          {addr.province}{addr.city}{addr.district}{addr.detail}
                        </div>
                        {addr.isDefault && (
                          <span className="text-xs text-primary">默认</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* 商品列表 */}
          <Card>
            <CardHeader>
              <CardTitle>商品清单</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <span>¥{item.product.price * item.quantity}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 订单摘要 */}
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
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>总计</span>
                <span className="text-primary">¥{total}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={loading || !selectedAddress}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {loading ? "提交中..." : "提交订单"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
