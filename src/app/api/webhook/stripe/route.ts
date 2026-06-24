import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe 未配置" }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "缺少签名" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook 签名验证失败:", err)
    return NextResponse.json({ error: "签名验证失败" }, { status: 400 })
  }

  // 处理支付成功事件
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      // 验证订单存在且金额匹配
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      })

      if (!order) {
        console.error(`订单 ${orderId} 不存在`)
        return NextResponse.json({ error: "订单不存在" }, { status: 400 })
      }

      // 验证支付金额（Stripe 金额单位是分）
      const paidAmount = session.amount_total ? session.amount_total / 100 : 0
      const expectedAmount = Number(order.finalAmount)

      if (Math.abs(paidAmount - expectedAmount) > 0.01) {
        console.error(`订单 ${orderId} 金额不匹配: 支付 ${paidAmount}, 预期 ${expectedAmount}`)
        return NextResponse.json({ error: "金额不匹配" }, { status: 400 })
      }

      // 验证订单状态
      if (order.status !== "PENDING") {
        console.log(`订单 ${orderId} 已处理过，当前状态: ${order.status}`)
        return NextResponse.json({ received: true })
      }

      // 更新订单状态
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      })

      console.log(`订单 ${orderId} 支付成功，金额: ${paidAmount}`)
    }
  }

  return NextResponse.json({ received: true })
}
