import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("开始填充种子数据...")

  // 创建会员等级
  const members = await Promise.all([
    prisma.member.upsert({
      where: { level: 1 },
      update: {},
      create: {
        level: 1,
        name: "普通会员",
        minAmount: 0,
        discount: 0.95,
        description: "注册即享，全场95折",
      },
    }),
    prisma.member.upsert({
      where: { level: 2 },
      update: {},
      create: {
        level: 2,
        name: "银卡会员",
        minAmount: 1000,
        discount: 0.9,
        description: "累计消费满¥1000，全场9折",
      },
    }),
    prisma.member.upsert({
      where: { level: 3 },
      update: {},
      create: {
        level: 3,
        name: "金卡会员",
        minAmount: 5000,
        discount: 0.85,
        description: "累计消费满¥5000，全场85折",
      },
    }),
  ])
  console.log("会员等级创建完成:", members.length)

  // 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "tops" },
      update: {},
      create: { name: "上衣", slug: "tops", description: "T恤、衬衫、外套等" },
    }),
    prisma.category.upsert({
      where: { slug: "pants" },
      update: {},
      create: { name: "裤子", slug: "pants", description: "休闲裤、牛仔裤等" },
    }),
    prisma.category.upsert({
      where: { slug: "shoes" },
      update: {},
      create: { name: "鞋子", slug: "shoes", description: "运动鞋、休闲鞋等" },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "配饰", slug: "accessories", description: "帽子、背包等" },
    }),
  ])
  console.log("分类创建完成:", categories.length)

  // 创建商品
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "classic-white-tshirt" },
      update: {},
      create: {
        name: "经典白色T恤",
        slug: "classic-white-tshirt",
        description: "100%纯棉材质，舒适透气。经典圆领设计，简约百搭。",
        price: 99,
        images: JSON.stringify(["/images/tshirt-1.jpg", "/images/tshirt-2.jpg"]),
        stock: 100,
        categoryId: categories[0].id,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "jeans-casual" },
      update: {},
      create: {
        name: "牛仔休闲裤",
        slug: "jeans-casual",
        description: "经典直筒版型，舒适面料，适合日常穿着。",
        price: 299,
        images: JSON.stringify(["/images/jeans-1.jpg"]),
        stock: 50,
        categoryId: categories[1].id,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "sport-shoes" },
      update: {},
      create: {
        name: "运动鞋",
        slug: "sport-shoes",
        description: "轻便舒适，缓震设计，适合运动和日常。",
        price: 499,
        images: JSON.stringify(["/images/shoes-1.jpg"]),
        stock: 30,
        categoryId: categories[2].id,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "backpack" },
      update: {},
      create: {
        name: "双肩背包",
        slug: "backpack",
        description: "大容量设计，多层收纳，适合通勤和旅行。",
        price: 199,
        images: JSON.stringify(["/images/bag-1.jpg"]),
        stock: 80,
        categoryId: categories[3].id,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "cotton-shirt" },
      update: {},
      create: {
        name: "棉质衬衫",
        slug: "cotton-shirt",
        description: "商务休闲两相宜，优质棉面料。",
        price: 189,
        images: JSON.stringify(["/images/shirt-1.jpg"]),
        stock: 60,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "casual-shorts" },
      update: {},
      create: {
        name: "休闲短裤",
        slug: "casual-shorts",
        description: "夏季必备，透气舒适。",
        price: 149,
        images: JSON.stringify(["/images/shorts-1.jpg"]),
        stock: 70,
        categoryId: categories[1].id,
      },
    }),
  ])
  console.log("商品创建完成:", products.length)

  // 创建测试用户
  const hashedPassword = await bcrypt.hash("123456", 10)
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "测试用户",
      password: hashedPassword,
      role: "CUSTOMER",
      memberId: members[0].id,
    },
  })
  console.log("测试用户创建完成:", user.email)

  // 创建管理员
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理员",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("管理员创建完成:", admin.email)

  // 创建测试地址
  await prisma.address.upsert({
    where: { id: "test-address-1" },
    update: {},
    create: {
      id: "test-address-1",
      userId: user.id,
      name: "张三",
      phone: "13800138000",
      province: "北京市",
      city: "北京市",
      district: "朝阳区",
      detail: "某某路123号",
      isDefault: true,
    },
  })
  console.log("测试地址创建完成")

  console.log("种子数据填充完成！")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
