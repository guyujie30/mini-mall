import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 验证管理员权限
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("未登录")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || user.role !== "ADMIN") {
    throw new Error("无权限")
  }

  return user
}
