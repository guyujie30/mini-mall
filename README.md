# Mini Mall

基于 Next.js + Prisma + PostgreSQL 的微型电商平台

## 技术栈

- Next.js 16 (App Router) + React 19
- TypeScript 5 + TailwindCSS 4 + shadcn/ui
- Prisma 6 + PostgreSQL 16
- NextAuth.js 5 (认证) + Stripe (支付)

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 数据库迁移
npx prisma migrate dev

# 填充种子数据
npx prisma db seed

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 功能

- 商品浏览、分类、搜索
- 购物车
- 会员系统（3 级折扣）
- 用户认证
- 订单管理
- Stripe 支付
- 后台管理

## 许可证

MIT
