import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { createCategorySchema } from "@/lib/validations/category"

// GET: 分类列表（公开）
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("获取分类列表失败:", error)
    return NextResponse.json(
      { error: "获取分类列表失败" },
      { status: 500 }
    )
  }
}

// POST: 创建分类（仅管理员）
export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validated = createCategorySchema.parse(body)

    // 检查是否重复
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: validated.name }, { slug: validated.slug }],
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: "分类名称或slug已存在" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: validated,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("创建分类失败:", error)
    if (
      error instanceof Error &&
      error.message === "无权限"
    ) {
      return NextResponse.json(
        { error: "需要管理员权限" },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    )
  }
}
