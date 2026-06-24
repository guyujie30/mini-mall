"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "上传失败")
        return
      }

      onChange(data.url)
      toast.success("上传成功")
    } catch {
      toast.error("上传失败")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <img
            src={value}
            alt="商品图片"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground">
            {loading ? "上传中..." : "点击上传"}
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
