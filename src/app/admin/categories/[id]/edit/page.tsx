"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  })

  useEffect(() => {
    fetch(`/api/categories/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
        })
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(
        `/api/categories/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "更新失败")
        return
      }

      toast.success("分类已更新")
      router.push("/admin/categories")
    } catch {
      toast.error("更新失败")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("确定删除该分类？")) return

    try {
      const response = await fetch(
        `/api/categories/${params.id}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "删除失败")
        return
      }

      toast.success("分类已删除")
      router.push("/admin/categories")
    } catch {
      toast.error("删除失败")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold">编辑分类</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          删除分类
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>分类信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>分类名称</Label>
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "更新中..." : "更新分类"}
              </Button>
              <Link
                href="/admin/categories"
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
