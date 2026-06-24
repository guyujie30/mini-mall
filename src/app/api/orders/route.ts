import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { createOrderSchema, orderQuerySchema } from "@/lib/validations/order"

// 生成订单号
function generateOrderNo(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD${date}${random}`
}

// GET: 订单列表
export async function GET(request: Request) {
  try {
    const user = await requireAuth()

    const { searchParams } = new URL(request.url)
    const query = orderQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
    })

    const where = {
      userId: user.id,
      ...(query.status && { status: query.status }),
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: true },
          },
          address: true,
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error("获取订单列表失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "获取订单列表失败" }, { status: 500 })
  }
}

// POST: 创建订单
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validated = createOrderSchema.parse(body)

    // 检查地址
    const address = await prisma.address.findFirst({
      where: { id: validated.addressId, userId: user.id },
    })
    if (!address) {
      return NextResponse.json({ error: "地址不存在" }, { status: 404 })
    }

    // 获取商品信息并检查库存
    const productIds = validated.items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "部分商品不存在或已下架" }, { status: 400 })
    }

    // 计算订单金额
    let totalAmount = 0
    const orderItems = validated.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      if (product.stock < item.quantity) {
        throw new Error(`${product.name} 库存不足`)
      }
      const subtotal = Number(product.price) * item.quantity
      totalAmount += subtotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      }
    })

    // 计算会员折扣
    const memberDiscount = user.member?.discount ?? 1
    const discountAmount = totalAmount * (1 - memberDiscount)
    const finalAmount = totalAmount * memberDiscount

    // 创建订单
    const order = await prisma.$transaction(async (tx) => {
      // 创建订单
      const newOrder = await tx.order.create({
        data: {
          orderNo: generateOrderNo(),
          userId: user.id,
          addressId: validated.addressId,
          totalAmount,
          discountAmount,
          finalAmount,
          memberLevel: user.member?.level,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
          address: true,
        },
      })

      // 扣减库存
      for (const item of validated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // 清空购物车中已下单的商品
      await tx.cartItem.deleteMany({
        where: {
          userId: user.id,
          productId: { in: productIds },
        },
      })

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("创建订单失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "创建订单失败" }, { status: 500 })
  }
}
