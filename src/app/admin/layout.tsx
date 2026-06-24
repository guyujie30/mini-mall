"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Tag } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingCart },
  { href: "/admin/categories", label: "分类管理", icon: Tag },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0">
          <h2 className="text-lg font-bold mb-4">后台管理</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={buttonVariants({
                    variant: isActive ? "secondary" : "ghost",
                    className: cn("w-full justify-start", isActive && "font-medium"),
                  })}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
