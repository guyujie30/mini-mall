import { z } from "zod"

// 创建商品验证
export const createProductSchema = z.object({
  name: z.string().max(100),
  slug: z.string().max(100).regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符"),
  description: z.string(),
  price: z.number().positive(),
  images: z.string().default("[]"),
  stock: z.number().int().min(0),
  categoryId: z.string(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// 更新商品验证
export const updateProductSchema = createProductSchema.partial()

// 商品查询参数
export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["price", "createdAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>
