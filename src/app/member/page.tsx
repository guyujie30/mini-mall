import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap } from "lucide-react"

const memberLevels = [
  {
    level: 1,
    name: "普通会员",
    icon: Star,
    minAmount: 0,
    discount: "95折",
    discountValue: 0.95,
    color: "bg-gray-100 text-gray-800",
    benefits: [
      "注册即享",
      "全场95折优惠",
      "生日专属优惠",
      "订单优先处理",
    ],
  },
  {
    level: 2,
    name: "银卡会员",
    icon: Zap,
    minAmount: 1000,
    discount: "9折",
    discountValue: 0.9,
    color: "bg-gray-200 text-gray-900",
    benefits: [
      "累计消费满 ¥1000 自动升级",
      "全场9折优惠",
      "免费配送",
      "专属客服通道",
      "新品优先体验",
    ],
  },
  {
    level: 3,
    name: "金卡会员",
    icon: Crown,
    minAmount: 5000,
    discount: "85折",
    discountValue: 0.85,
    color: "bg-yellow-100 text-yellow-800",
    benefits: [
      "累计消费满 ¥5000 自动升级",
      "全场85折优惠",
      "免费配送",
      "专属VIP客服",
      "新品优先体验",
      "限量商品优先购买",
      "年度礼品",
    ],
  },
]

export default function MemberPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">会员等级</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          注册即享会员优惠，消费越多等级越高，折扣越大！
        </p>
      </div>

      {/* Member Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {memberLevels.map((member) => {
          const Icon = member.icon
          return (
            <Card key={member.level} className="relative overflow-hidden">
              {member.level === 3 && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 text-xs font-medium rounded-bl-lg">
                  最高等级
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <Badge className={member.color}>{member.name}</Badge>
                <CardTitle className="mt-4">
                  <span className="text-4xl font-bold">{member.discount}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {member.minAmount > 0
                    ? `累计消费满 ¥${member.minAmount} 自动升级`
                    : "注册即享"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {member.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={member.level === 3 ? "default" : "outline"} asChild>
                  <Link href="/auth/register">
                    {member.level === 1 ? "立即注册" : "了解更多"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">如何成为会员？</h3>
              <p className="text-muted-foreground">
                注册账户即自动成为普通会员，享受全场95折优惠。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">会员等级如何提升？</h3>
              <p className="text-muted-foreground">
                系统会根据您的累计消费金额自动升级。累计消费满 ¥1000 升级为银卡会员，满 ¥5000 升级为金卡会员。
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">会员折扣如何使用？</h3>
              <p className="text-muted-foreground">
                会员折扣在结算时自动应用，无需手动输入优惠码。折扣适用于全场商品。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Card className="bg-primary text-primary-foreground inline-block">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-2">准备好成为会员了吗？</h3>
            <p className="mb-4 opacity-90">立即注册，享受专属优惠！</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">立即注册</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
