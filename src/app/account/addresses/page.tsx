"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    detail: "",
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = () => {
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleSubmit = async () => {
    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || "保存失败")
        return
      }

      toast.success(editingId ? "地址已更新" : "地址已添加")
      setDialogOpen(false)
      resetForm()
      fetchAddresses()
    } catch {
      toast.error("保存失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除该地址？")) return

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        toast.error("删除失败")
        return
      }

      toast.success("地址已删除")
      fetchAddresses()
    } catch {
      toast.error("删除失败")
    }
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setForm({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      detail: address.detail,
      isDefault: address.isDefault,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
      isDefault: false,
    })
  }

  if (loading) {
    return <div className="container mx-auto py-16 text-center">加载中...</div>
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/account" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">收货地址</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">管理您的收货地址</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              添加地址
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "编辑地址" : "添加地址"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>收货人</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="姓名"
                  />
                </div>
                <div className="space-y-2">
                  <Label>手机号</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="手机号"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>省</Label>
                  <Input
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    placeholder="省份"
                  />
                </div>
                <div className="space-y-2">
                  <Label>市</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="城市"
                  />
                </div>
                <div className="space-y-2">
                  <Label>区</Label>
                  <Input
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="区县"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>详细地址</Label>
                <Input
                  value={form.detail}
                  onChange={(e) => setForm({ ...form, detail: e.target.value })}
                  placeholder="街道、门牌号等"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                <Label htmlFor="isDefault">设为默认地址</Label>
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                {editingId ? "更新" : "保存"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无收货地址</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{address.name}</span>
                      <span className="text-muted-foreground">{address.phone}</span>
                      {address.isDefault && (
                        <Badge variant="secondary">默认</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {address.province}{address.city}{address.district}{address.detail}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
