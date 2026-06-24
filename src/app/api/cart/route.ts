import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { addToCartSchema } from "@/lib/validations/cart"

// GET: 获取购物车列表
export async function GET() {
  try {
    const user = await requireAuth()

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    return NextResponse.json({ items: cartItems, total })
  } catch (error) {
    console.error("获取购物车失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "获取购物车失败" }, { status: 500 })
  }
}

// POST: 添加商品到购物车
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validated = addToCartSchema.parse(body)

    // 检查商品是否存在且上架
    const product = await prisma.product.findUnique({
      where: { id: validated.productId, isActive: true },
    })
    if (!product) {
      return NextResponse.json({ error: "商品不存在或已下架" }, { status: 404 })
    }

    // 检查库存
    if (product.stock < validated.quantity) {
      return NextResponse.json({ error: "库存不足" }, { status: 400 })
    }

    // 检查购物车是否已有该商品
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId: user.id, productId: validated.productId },
      },
    })

    let cartItem
    if (existingItem) {
      // 更新数量
      const newQuantity = existingItem.quantity + validated.quantity
      if (newQuantity > product.stock) {
        return NextResponse.json({ error: "库存不足" }, { status: 400 })
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      })
    } else {
      // 新增
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: validated.productId,
          quantity: validated.quantity,
        },
        include: { product: true },
      })
    }

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error("添加购物车失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "添加购物车失败" }, { status: 500 })
  }
}

// DELETE: 清空购物车
export async function DELETE() {
  try {
    const user = await requireAuth()

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    })

    return NextResponse.json({ message: "购物车已清空" })
  } catch (error) {
    console.error("清空购物车失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "清空购物车失败" }, { status: 500 })
  }
}
