import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { stripe, isStripeConfigured } from "@/lib/stripe"
import { z } from "zod"

const checkoutSchema = z.object({
  orderId: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured || !stripe) {
      return NextResponse.json(
        { error: "支付功能未配置" },
        { status: 503 }
      )
    }

    const user = await requireAuth()

    const body = await request.json()
    const { orderId } = checkoutSchema.parse(body)

    // 获取订单
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
      include: { items: { include: { product: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 })
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "订单状态异常" }, { status: 400 })
    }

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "cny",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account/orders/${orderId}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account/orders/${orderId}?canceled=true`,
      metadata: {
        orderId: order.id,
        orderNo: order.orderNo,
      },
    })

    // 更新订单支付 ID
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("创建支付会话失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "创建支付会话失败" }, { status: 500 })
  }
}
