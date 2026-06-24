import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { updateCategorySchema } from "@/lib/validations/category"

// GET: 分类详情
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("获取分类详情失败:", error)
    return NextResponse.json(
      { error: "获取分类详情失败" },
      { status: 500 }
    )
  }
}

// PUT: 更新分类（仅管理员）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await request.json()
    const validated = updateCategorySchema.parse(body)

    // 检查分类是否存在
    const existing = await prisma.category.findUnique({
      where: { id },
    })
    if (!existing) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }

    // 检查是否与其他分类冲突
    if (validated.name || validated.slug) {
      const orConditions = []
      if (validated.name) orConditions.push({ name: validated.name })
      if (validated.slug) orConditions.push({ slug: validated.slug })

      const conflict = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: orConditions,
        },
      })
      if (conflict) {
        return NextResponse.json(
          { error: "分类名称或slug已存在" },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validated,
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("更新分类失败:", error)
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
      { error: "更新分类失败" },
      { status: 500 }
    )
  }
}

// DELETE: 删除分类（仅管理员）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // 检查分类是否存在
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    })
    if (!existing) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }

    // 检查是否有关联商品
    if (existing._count.products > 0) {
      return NextResponse.json(
        { error: "该分类下有商品，无法删除" },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ message: "分类已删除" })
  } catch (error) {
    console.error("删除分类失败:", error)
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
      { error: "删除分类失败" },
      { status: 500 }
    )
  }
}
