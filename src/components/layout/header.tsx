"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, Search, LogOut, Package } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Mini Mall</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              全部商品
            </Link>
            <Link href="/member" className="text-sm font-medium transition-colors hover:text-primary">
              会员中心
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/search" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <Search className="h-5 w-5" />
            </Link>

            <Link href="/cart" className={buttonVariants({ variant: "ghost", size: "icon" }) + " relative"}>
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                  <User className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name || "用户"}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/account" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      个人中心
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account/orders" className="flex items-center w-full">
                      <Package className="mr-2 h-4 w-4" />
                      我的订单
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                登录
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " md:hidden"}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/products" className="text-lg font-medium">
                    全部商品
                  </Link>
                  <Link href="/member" className="text-lg font-medium">
                    会员中心
                  </Link>
                  <Link href="/cart" className="text-lg font-medium">
                    购物车
                  </Link>
                  {session ? (
                    <>
                      <Link href="/account" className="text-lg font-medium">
                        个人中心
                      </Link>
                      <Link href="/account/orders" className="text-lg font-medium">
                        我的订单
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-lg font-medium text-destructive text-left"
                      >
                        退出登录
                      </button>
                    </>
                  ) : (
                    <Link href="/auth/login" className="text-lg font-medium">
                      登录
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
