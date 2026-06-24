# Mini Mall 开发指南

## 常用命令
```bash
npm run dev                    # 启动开发
npx prisma migrate dev         # 数据库迁移
npx prisma db seed             # 种子数据
npx prisma studio              # 数据库管理界面
```

## 路径别名
`@/` → `src/`

## 路由

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/products` | 商品列表 |
| `/products/[id]` | 商品详情 |
| `/cart` | 购物车 |
| `/checkout` | 结算页 |
| `/member` | 会员介绍 |
| `/auth/login` | 登录 |
| `/auth/register` | 注册 |
| `/account` | 用户中心 |
| `/account/orders` | 订单列表 |
| `/account/orders/[id]` | 订单详情 |
| `/account/addresses` | 地址管理 |
| `/admin` | 后台仪表盘 |
| `/admin/products` | 商品管理 |
| `/admin/orders` | 订单管理 |
| `/admin/categories` | 分类管理 |

## 数据库模型

### User (用户)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| email | String | 邮箱（唯一） |
| name | String? | 姓名 |
| password | String | 密码 |
| role | Enum | CUSTOMER / ADMIN |
| memberId | String? | 关联会员等级 |

### Member (会员等级)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| level | Int | 等级（1/2/3，唯一） |
| name | String | 名称 |
| minAmount | Decimal | 最低消费额度 |
| discount | Decimal | 折扣率 |

**等级规则：**
- 1 = 普通会员，¥0，95 折 (0.95)
- 2 = 银卡会员，¥1000，9 折 (0.90)
- 3 = 金卡会员，¥5000，85 折 (0.85)

### Product (商品)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| name | String | 商品名 |
| slug | String | URL 标识（唯一） |
| description | String | 描述 |
| price | Decimal | 价格 |
| images | String[] | 图片数组 |
| stock | Int | 库存 |
| categoryId | String | 关联分类 |
| isActive | Boolean | 是否上架 |
| isFeatured | Boolean | 是否推荐 |

### Category (分类)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| name | String | 名称（唯一） |
| slug | String | URL 标识（唯一） |
| description | String? | 描述 |

### CartItem (购物车)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| userId | String | 关联用户 |
| productId | String | 关联商品 |
| quantity | Int | 数量 |

userId + productId 联合唯一

### Order (订单)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| orderNo | String | 订单号（唯一） |
| userId | String | 关联用户 |
| addressId | String | 关联地址 |
| totalAmount | Decimal | 商品总额 |
| discountAmount | Decimal | 折扣金额 |
| finalAmount | Decimal | 实付金额 |
| memberLevel | Int? | 下单时会员等级 |
| status | Enum | 订单状态 |

**状态流转：**
- PENDING（待付款）→ PAID（已付款）→ SHIPPED（已发货）→ DELIVERED（已收货）
- 可取消：CANCELLED
- 可退款：REFUNDED

### OrderItem (订单项)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| orderId | String | 关联订单 |
| productId | String | 关联商品 |
| quantity | Int | 数量 |
| price | Decimal | 单价 |
| subtotal | Decimal | 小计 |

### Address (地址)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| userId | String | 关联用户 |
| name | String | 收货人 |
| phone | String | 手机号 |
| province | String | 省 |
| city | String | 市 |
| district | String | 区 |
| detail | String | 详细地址 |
| isDefault | Boolean | 是否默认 |

## 代码规范
- 客户端组件需显式标记 `"use client"`
- 数据库操作用 `src/lib/prisma.ts` 导出的 Prisma Client
- 表单用 React Hook Form + Zod 验证
- 样式用 TailwindCSS，组件优先用 shadcn/ui
- TypeScript 严格模式
- UI 文案用中文
- 代码注释用中文

## Skills
- `/crud-generator`: 生成 CRUD 功能模块（API + 页面 + 表单）

## 待开发
- [x] 后端 API（商品/购物车/订单/地址）
- [x] NextAuth 认证配置
- [x] Stripe 支付集成（基础配置）
- [x] 后台管理页面
- [x] 会员自动升级逻辑
- [ ] 商品图片上传
- [ ] 搜索功能优化
- [ ] 订单详情页支付按钮

<!-- superpowers-zh:begin (do not edit between these markers) -->
# Superpowers-ZH 中文增强版

本项目已安装 superpowers-zh 技能框架（20 个 skills）。

## 核心规则

1. **收到任务时，先检查是否有匹配的 skill** — 哪怕只有 1% 的可能性也要检查
2. **设计先于编码** — 收到功能需求时，先用 brainstorming skill 做需求分析
3. **测试先于实现** — 写代码前先写测试（TDD）
4. **验证先于完成** — 声称完成前必须运行验证命令

## 可用 Skills

Skills 位于 `.claude/skills/` 目录，每个 skill 有独立的 `SKILL.md` 文件。

- **brainstorming**: 在任何创造性工作之前必须使用此技能——创建功能、构建组件、添加功能或修改行为。在实现之前先探索用户意图、需求和设计。
- **chinese-code-review**: 中文 review 沟通参考——话术模板、分级标注（必须修复/建议修改/仅供参考）、国内团队常见反模式应对。仅在用户显式 /chinese-code-review 时调用，不要根据上下文自动触发。
- **chinese-commit-conventions**: 中文 commit 与 changelog 配置参考——Conventional Commits 中文适配、commitlint/husky/commitizen 中文模板、conventional-changelog 中文配置。仅在用户显式 /chinese-commit-conventions 时调用，不要根据上下文自动触发。
- **chinese-documentation**: 中文文档排版参考——中英文空格、全半角标点、术语保留、链接格式、中文文案排版指北约定。仅在用户显式 /chinese-documentation 时调用，不要根据上下文自动触发。
- **chinese-git-workflow**: 国内 Git 平台配置参考——Gitee、Coding.net、极狐 GitLab、CNB 的 SSH/HTTPS/凭据/CI 接入差异与镜像同步配置。仅在用户显式 /chinese-git-workflow 时调用，不要根据上下文自动触发。
- **dispatching-parallel-agents**: 当面对 2 个以上可以独立进行、无共享状态或顺序依赖的任务时使用
- **executing-plans**: 当你有一份书面实现计划需要在单独的会话中执行，并设有审查检查点时使用
- **finishing-a-development-branch**: 当实现完成、所有测试通过、需要决定如何集成工作时使用——通过提供合并、PR 或清理等结构化选项来引导开发工作的收尾
- **mcp-builder**: MCP 服务器构建方法论 — 系统化构建生产级 MCP 工具，让 AI 助手连接外部能力
- **receiving-code-review**: 收到代码审查反馈后、实施建议之前使用，尤其当反馈不明确或技术上有疑问时——需要技术严谨性和验证，而非敷衍附和或盲目执行
- **requesting-code-review**: 完成任务、实现重要功能或合并前使用，用于验证工作成果是否符合要求
- **subagent-driven-development**: 当在当前会话中执行包含独立任务的实现计划时使用
- **systematic-debugging**: 遇到任何 bug、测试失败或异常行为时使用，在提出修复方案之前执行
- **test-driven-development**: 在实现任何功能或修复 bug 时使用，在编写实现代码之前
- **using-git-worktrees**: 当需要开始与当前工作区隔离的功能开发，或在执行实现计划之前使用——通过原生工具或 git worktree 回退机制确保隔离工作区存在
- **using-superpowers**: 在开始任何对话时使用——确立如何查找和使用技能，要求在任何响应（包括澄清性问题）之前调用 Skill 工具
- **verification-before-completion**: 在宣称工作完成、已修复或测试通过之前使用，在提交或创建 PR 之前——必须运行验证命令并确认输出后才能声称成功；始终用证据支撑断言
- **workflow-runner**: 在 Claude Code / OpenClaw / Cursor 中直接运行 agency-orchestrator YAML 工作流——无需 API key，使用当前会话的 LLM 作为执行引擎。当用户提供 .yaml 工作流文件或要求多角色协作完成任务时触发。
- **writing-plans**: 当你有规格说明或需求用于多步骤任务时使用，在动手写代码之前
- **writing-skills**: 当创建新技能、编辑现有技能或在部署前验证技能是否有效时使用

## 如何使用

当任务匹配某个 skill 时，使用 `Skill` 工具加载对应 skill 并严格遵循其流程。绝不要用 Read 工具读取 SKILL.md 文件。

如果你认为哪怕只有 1% 的可能性某个 skill 适用于你正在做的事情，你必须调用该 skill 检查。
<!-- superpowers-zh:end -->
