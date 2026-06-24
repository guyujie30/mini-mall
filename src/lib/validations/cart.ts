import { z } from "zod"

// 添加购物车项
export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
})

// 更新购物车项数量
export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("数量必须大于 0"),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartInput = z.infer<typeof updateCartItemSchema>
