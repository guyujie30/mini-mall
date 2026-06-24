import { z } from "zod"

// 创建订单
export const createOrderSchema = z.object({
  addressId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
})

// 更新订单状态
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
})

// 订单查询参数
export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.string().optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
export type OrderQuery = z.infer<typeof orderQuerySchema>
