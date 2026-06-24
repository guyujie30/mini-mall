import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/session"
import { addressSchema } from "@/lib/validations/address"

// GET: 获取地址列表
export async function GET() {
  try {
    const user = await requireAuth()

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("获取地址列表失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    return NextResponse.json({ error: "获取地址列表失败" }, { status: 500 })
  }
}

// POST: 创建地址
export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const body = await request.json()
    const validated = addressSchema.parse(body)

    // 如果设为默认，先取消其他默认地址
    if (validated.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        ...validated,
        userId: user.id,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error("创建地址失败:", error)
    if (error instanceof Error && error.message === "未登录") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "创建地址失败" }, { status: 500 })
  }
}
