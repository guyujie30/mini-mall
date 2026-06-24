import { z } from "zod"

// 创建/更新地址
export const addressSchema = z.object({
  name: z.string().max(50),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
  province: z.string(),
  city: z.string(),
  district: z.string(),
  detail: z.string().max(200),
  isDefault: z.boolean().default(false),
})

export type AddressInput = z.infer<typeof addressSchema>
