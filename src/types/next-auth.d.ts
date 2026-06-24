import "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    memberLevel?: number
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string
      role?: string
      memberLevel?: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    memberLevel?: number
  }
}
