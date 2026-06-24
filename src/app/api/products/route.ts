import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { createProductSchema, productQuerySchema } from "@/lib/validations/product"

// GET: 商品列表（公开）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = productQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
    })

    const where = {
      isActive: true,
      ...(query.category && { category: { slug: query.category } }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search } },
          { description: { contains: query.search } },
        ],
      }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error("获取商品列表失败:", error)
    return NextResponse.json({ error: "获取商品列表失败" }, { status: 500 })
  }
}

// POST: 创建商品（仅管理员）
export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validated = createProductSchema.parse(body)

    // 检查 slug 是否已存在
    const existing = await prisma.product.findUnique({
      where: { slug: validated.slug },
    })
    if (existing) {
      return NextResponse.json({ error: "slug 已存在" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: validated,
      include: { category: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("创建商品失败:", error)
    if (error instanceof Error && error.message === "无权限") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "创建商品失败" }, { status: 500 })
  }
}
