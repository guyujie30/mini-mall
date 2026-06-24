# CRUD 生成器

为电商系统快速生成 CRUD 功能模块。

## 触发条件
当用户要求生成某个模块的增删改查功能时使用（如"生成商品管理 CRUD"、"给订单加 CRUD"）。

## 执行流程

### 1. 确认需求
询问用户：
- 模块名称（如 Product、Category、Order）
- 需要哪些字段
- 是否需要关联其他模型
- 需要哪些页面（列表/创建/编辑/详情）

### 2. 生成 Prisma 模型
在 `prisma/schema.prisma` 中添加模型定义。

### 3. 生成 API 路由
创建 `src/app/api/[module]/route.ts`：
- GET: 列表查询（支持分页、筛选）
- POST: 创建记录

创建 `src/app/api/[module]/[id]/route.ts`：
- GET: 单条查询
- PUT: 更新记录
- DELETE: 删除记录

### 4. 生成页面
创建以下页面文件：

**列表页** `src/app/admin/[module]/page.tsx`：
- 数据表格（使用 shadcn/ui Table）
- 搜索/筛选
- 分页
- 操作按钮（编辑/删除）

**创建页** `src/app/admin/[module]/new/page.tsx`：
- 表单（使用 React Hook Form + Zod）
- 提交逻辑

**编辑页** `src/app/admin/[module]/[id]/edit/page.tsx`：
- 表单（预填数据）
- 更新逻辑

### 5. 生成验证 Schema
创建 `src/lib/validations/[module].ts`：
- Zod schema 用于表单验证和 API 验证

## 代码模板

### API 路由模板
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET: 列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  const [items, total] = await Promise.all([
    prisma.[model].findMany({
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.[model].count(),
  ])

  return NextResponse.json({ items, total, page, limit })
}

// POST: 创建
export async function POST(request: Request) {
  const body = await request.json()
  const validated = [schema].parse(body)

  const item = await prisma.[model].create({
    data: validated,
  })

  return NextResponse.json(item, { status: 201 })
}
```

### 列表页模板
```typescript
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function [Module]ListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // 获取数据
  // 删除操作
  // 渲染表格
}
```

### 表单模板
```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { [schema] } from "@/lib/validations/[module]"

export default function [Module]Form({ defaultValues, onSubmit }) {
  const form = useForm({
    resolver: zodResolver([schema]),
    defaultValues,
  })

  // 渲染表单字段
  // 提交处理
}
```

## 命名规范
| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 模型 | PascalCase | Product |
| 路由 | kebab-case | products |
| 页面 | PascalCase + Page | ProductListPage |
| Schema | camelCase + Schema | productSchema |
| API | 模型复数 | /api/products |

## 注意事项
- 所有 API 需要验证用户权限（检查 session）
- 删除操作需要软删除或确认机制
- 列表页默认每页 10 条
- 表单提交后跳转回列表页
- 错误处理使用 toast 提示
