import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { updateProductSchema } from "@/lib/validations/product"

// GET: 商品详情（公开）
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: "商品不存在" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("获取商品详情失败:", error)
    return NextResponse.json({ error: "获取商品详情失败" }, { status: 500 })
  }
}

// PUT: 更新商品（仅管理员）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const validated = updateProductSchema.parse(body)

    // 检查商品是否存在
    const existing = await prisma.product.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "商品不存在" }, { status: 404 })
    }

    // 如果更新 slug，检查是否冲突
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: validated.slug },
      })
      if (slugExists) {
        return NextResponse.json({ error: "slug 已存在" }, { status: 400 })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validated,
      include: { category: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("更新商品失败:", error)
    if (error instanceof Error && error.message === "无权限") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "更新商品失败" }, { status: 500 })
  }
}

// DELETE: 删除商品（仅管理员，软删除）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const existing = await prisma.product.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json({ error: "商品不存在" }, { status: 404 })
    }

    // 软删除：设置为下架状态
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "商品已下架" })
  } catch (error) {
    console.error("删除商品失败:", error)
    if (error instanceof Error && error.message === "无权限") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }
    return NextResponse.json({ error: "删除商品失败" }, { status: 500 })
  }
}
