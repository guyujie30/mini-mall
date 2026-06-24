import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(1, "姓名不能为空").max(50),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少6位").max(100),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = registerSchema.parse(body)

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })
    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 400 })
    }

    // 获取普通会员等级
    const defaultMember = await prisma.member.findUnique({
      where: { level: 1 },
    })

    // 加密密码
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: "CUSTOMER",
        memberId: defaultMember?.id,
      },
      include: { member: true },
    })

    return NextResponse.json(
      {
        message: "注册成功",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          member: user.member?.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("注册失败:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "注册失败" }, { status: 500 })
  }
}
