import { prisma } from "@/lib/prisma"

// 检查并升级会员等级
export async function checkMemberUpgrade(userId: string) {
  // 计算用户累计消费（排除已取消和退款的订单）
  const result = await prisma.order.aggregate({
    _sum: { finalAmount: true },
    where: {
      userId,
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
  })

  const totalSpent = result._sum.finalAmount || 0

  // 获取所有会员等级
  const members = await prisma.member.findMany({
    orderBy: { level: "desc" },
  })

  // 找到符合条件的最高等级
  const eligibleMember = members.find((m) => totalSpent >= m.minAmount)

  if (!eligibleMember) return null

  // 获取用户当前信息
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { member: true },
  })

  if (!user) return null

  // 如果需要升级
  if (!user.memberId || (user.member && eligibleMember.level > user.member.level)) {
    await prisma.user.update({
      where: { id: userId },
      data: { memberId: eligibleMember.id },
    })

    return {
      upgraded: true,
      fromLevel: user.member?.level || 0,
      toLevel: eligibleMember.level,
      memberName: eligibleMember.name,
      discount: eligibleMember.discount,
    }
  }

  return { upgraded: false }
}
