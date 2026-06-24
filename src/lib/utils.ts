import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 安全解析商品图片 JSON 字符串
export function parseImages(images: string | null): string[] {
  try {
    const parsed = JSON.parse(images || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
