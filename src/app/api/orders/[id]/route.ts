import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { requireAdmin } from "@/lib/admin"
import { updateOrderStatusSchema } from "@/lib/validations/order"

// GET: 订单详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const order = await prisma.order.findFirst({
      where: { id, userId: user.id },
      include: {
        items: {
          include: { product: true },
        },
        address: true,
        user: {
          include: { member: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("获取订单详情失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "获取订单详情失败" }, { status: 500 })
  }
}

// PUT: 更新订单状态（仅管理员）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const validated = updateOrderStatusSchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 })
    }

    // 验证状态流转
    const validTransitions: Record<string, string[]> = {
      PENDING: ["PAID", "CANCELLED"],
      PAID: ["SHIPPED", "CANCELLED", "REFUNDED"],
      SHIPPED: ["DELIVERED", "REFUNDED"],
      DELIVERED: [],
      CANCELLED: [],
      REFUNDED: [],
    }

    if (!validTransitions[order.status]?.includes(validated.status)) {
      return NextResponse.json(
        { error: `订单状态不能从 ${order.status} 变更为 ${validated.status}` },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = { status: validated.status }
    if (validated.status === "PAID") updateData.paidAt = new Date()
    if (validated.status === "SHIPPED") updateData.shippedAt = new Date()
    if (validated.status === "DELIVERED") updateData.deliveredAt = new Date()

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: { include: { product: true } },
        address: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("更新订单状态失败:", error)
    if (error instanceof Error && error.message === "无权限") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "更新订单状态失败" }, { status: 500 })
  }
}
