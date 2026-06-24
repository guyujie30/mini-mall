import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // 保护后台路由
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
    // 这里只能做基本的登录检查，角色检查在页面/API 中进行
  }

  // 保护需要登录的路由
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*"],
}
