import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { updateCartItemSchema } from "@/lib/validations/cart"

// PUT: 更新购物车项数量
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const body = await request.json()
    const validated = updateCartItemSchema.parse(body)

    // 检查购物车项是否存在
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id },
      include: { product: true },
    })
    if (!cartItem) {
      return NextResponse.json({ error: "购物车项不存在" }, { status: 404 })
    }

    // 检查库存
    if (validated.quantity > cartItem.product.stock) {
      return NextResponse.json({ error: "库存不足" }, { status: 400 })
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: validated.quantity },
      include: { product: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("更新购物车失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "更新购物车失败" }, { status: 500 })
  }
}

// DELETE: 删除购物车项
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id },
    })
    if (!cartItem) {
      return NextResponse.json({ error: "购物车项不存在" }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: "已从购物车移除" })
  } catch (error) {
    console.error("删除购物车项失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "删除购物车项失败" }, { status: 500 })
  }
}
