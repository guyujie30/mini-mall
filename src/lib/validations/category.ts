import { z } from "zod"

// 创建分类
export const createCategorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(50),
  slug: z
    .string()
    .min(1, "slug 不能为空")
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "slug 只能包含小写字母、数字和连字符"
    ),
  description: z.string().max(200).optional(),
})

// 更新分类
export const updateCategorySchema =
  createCategorySchema.partial()

export type CreateCategoryInput = z.infer<
  typeof createCategorySchema
>
export type UpdateCategoryInput = z.infer<
  typeof updateCategorySchema
>
