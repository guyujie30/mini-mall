import { z } from "zod"

// 创建/更新地址
export const addressSchema = z.object({
  name: z.string().min(1, "收货人姓名不能为空").max(50),
  phone: z.string().min(1, "手机号不能为空").regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  province: z.string().min(1, "省份不能为空"),
  city: z.string().min(1, "城市不能为空"),
  district: z.string().min(1, "区县不能为空"),
  detail: z.string().min(1, "详细地址不能为空").max(200),
  isDefault: z.boolean().default(false),
})

export type AddressInput = z.infer<typeof addressSchema>
