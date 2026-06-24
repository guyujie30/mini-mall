import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Home } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-2">支付成功！</h1>
              <p className="text-muted-foreground">
                您的订单已成功支付，我们将尽快为您发货。
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/account/orders" className={buttonVariants({ className: "w-full" })}>
                <Package className="mr-2 h-4 w-4" />
                查看我的订单
              </Link>
              <Link href="/" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
