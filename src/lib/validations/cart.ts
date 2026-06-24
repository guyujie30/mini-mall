import { z } from "zod"

// 添加购物车项
export const addToCartSchema = z.object({
  productId: z.string().min("商品ID不能为空"),
  quantity: z.number().int().positive("数量必须大于 0").default(1),
})

// 更新购物车项数量
export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive("数量必须大于 0"),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartInput = z.infer<typeof updateCartItemSchema>
