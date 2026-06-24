import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 })
    }

    // 验证文件类型（从 MIME 类型反推安全扩展名，防止伪造）
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    }
    const ext = mimeToExt[file.type]
    if (!ext) {
      return NextResponse.json(
        { error: "只支持 JPG/PNG/WebP/GIF 格式" },
        { status: 400 }
      )
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "文件大小不能超过 5MB" },
        { status: 400 }
      )
    }

    // 生成唯一文件名（使用从 MIME 类型推导的扩展名，忽略客户端文件名）
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(process.cwd(), "public", "uploads", fileName)
    await writeFile(filePath, buffer)

    // 返回文件 URL
    const url = `/uploads/${fileName}`

    return NextResponse.json({ url, fileName })
  } catch (error) {
    console.error("上传失败:", error)
    if (error instanceof Error && error.message === "无权限") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }
    return NextResponse.json({ error: "上传失败" }, { status: 500 })
  }
}
