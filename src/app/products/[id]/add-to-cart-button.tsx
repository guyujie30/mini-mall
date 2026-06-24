"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface AddToCartButtonProps {
  productId: string
  stock: number
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("请先登录")
      router.push("/auth/login")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "添加失败")
        return
      }

      toast.success("已添加到购物车")
    } catch {
      toast.error("添加失败")
    } finally {
      setLoading(false)
    }
  }

  if (stock <= 0) {
    return (
      <Button size="lg" disabled className="w-full">
        已售罄
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">数量:</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          disabled={quantity >= stock}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={loading}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {loading ? "添加中..." : "加入购物车"}
        </Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
