"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Button,
  buttonVariants,
} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/image-upload"

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: "[]",
    isActive: true,
    isFeatured: false,
  })

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "创建失败")
        return
      }

      toast.success("商品已创建")
      router.push("/admin/products")
    } catch {
      toast.error("创建失败")
    } finally {
      setLoading(false)
    }
  }

  const updateImage = (url: string) => {
    setForm({
      ...form,
      images: url ? JSON.stringify([url]) : "[]",
    })
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">添加商品</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>商品名称</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>URL 标识 (slug)</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="product-name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>商品描述</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>价格</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>库存</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>分类</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) =>
                    setForm({ ...form, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>商品图片</Label>
              <ImageUpload
                value={
                  form.images !== "[]"
                    ? JSON.parse(form.images)[0]
                    : ""
                }
                onChange={updateImage}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isActive: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="isActive">上架</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="isFeatured">推荐</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "创建中..." : "创建商品"}
              </Button>
              <Link
                href="/admin/products"
                className={buttonVariants({ variant: "outline" })}
              >
                取消
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
