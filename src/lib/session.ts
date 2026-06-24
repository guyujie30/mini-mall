import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 获取当前登录用户
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { member: true },
  })

  return user
}

// 获取当前用户 ID（未登录抛错）
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("未登录")
  }
  return user
}
