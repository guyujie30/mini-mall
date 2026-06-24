import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { z } from "zod"

const mockPaymentSchema = z.object({
  orderId: z.string(),
})

// 模拟支付 API
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const { orderId } = mockPaymentSchema.parse(body)

    // 获取订单
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
    })

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 })
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "订单状态异常" }, { status: 400 })
    }

    // 模拟支付成功，更新订单状态
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        paymentId: `MOCK-${Date.now()}`,
      },
    })

    return NextResponse.json({
      success: true,
      message: "支付成功",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("模拟支付失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "支付失败" }, { status: 500 })
  }
}
