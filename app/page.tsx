"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Eye,
  Menu,
  Home,
  Tag,
  UtensilsCrossed,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { api } from "@/lib/config"

interface Admin {
  token: string
  username: string
}

interface User {
  _id: string
  phone: string
  name: string
  createdAt: string
}

interface Category {
  _id: string
  name: string
  description: string
}

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: Category
  image: string
  available: boolean
}

interface Order {
  _id: string
  user: User
  items: Array<{
    menu: MenuItem
    quantity: number
  }>
  address: string
  paymentReceipt: string
  status: string
  createdAt: string
}

interface PaymentMethod {
  _id: string
  bankName: string
  accountNumber: string
}

export default function AdminPanel() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" })
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    available: true,
  })
  const [paymentForm, setPaymentForm] = useState({ bankName: "", accountNumber: "" })

  // Dialog states
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [menuDialog, setMenuDialog] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin")
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
    }
  }, [])

  useEffect(() => {
    if (admin) {
      fetchAllData()
    }
  }, [admin])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(api.adminLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      })
      const data = await response.json()
      if (response.ok) {
        const adminData = { token: data.token, username: loginForm.username }
        setAdmin(adminData)
        localStorage.setItem("admin", JSON.stringify(adminData))
        toast({ title: "Login successful" })
      } else {
        toast({ title: "Login failed", description: data.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Login failed", description: "Network error", variant: "destructive" })
    }
    setLoading(false)
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }

  const fetchAllData = async () => {
    try {
      const [usersRes, categoriesRes, menuRes, ordersRes, paymentsRes] = await Promise.all([
        fetch(api.users),
        fetch(api.categories),
        fetch(api.menu),
        fetch(api.orders),
        fetch(api.paymentMethods),
      ])

      if (usersRes.ok) setUsers(await usersRes.json())
      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (menuRes.ok) setMenuItems(await menuRes.json())
      if (ordersRes.ok) setOrders(await ordersRes.json())
      if (paymentsRes.ok) setPaymentMethods(await paymentsRes.json())
    } catch (error) {
      toast({ title: "Error fetching data", variant: "destructive" })
    }
  }

  const createCategory = async () => {
    try {
      const response = await fetch(api.categories, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      })
      if (response.ok) {
        toast({ title: "Category created successfully" })
        setCategoryForm({ name: "", description: "" })
        setCategoryDialog(false)
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error creating category", variant: "destructive" })
    }
  }

  const updateCategory = async () => {
    try {
      const response = await fetch(api.category(editingItem._id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      })
      if (response.ok) {
        toast({ title: "Category updated successfully" })
        setCategoryForm({ name: "", description: "" })
        setCategoryDialog(false)
        setEditingItem(null)
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error updating category", variant: "destructive" })
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(api.category(id), {
        method: "DELETE",
      })
      if (response.ok) {
        toast({ title: "Category deleted successfully" })
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error deleting category", variant: "destructive" })
    }
  }

  const createMenuItem = async () => {
    try {
      const response = await fetch(api.menu, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuForm),
      })
      if (response.ok) {
        toast({ title: "Menu item created successfully" })
        setMenuForm({ name: "", description: "", price: 0, category: "", image: "", available: true })
        setMenuDialog(false)
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error creating menu item", variant: "destructive" })
    }
  }

  const updateMenuItem = async () => {
    try {
      const response = await fetch(api.menuItem(editingItem._id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuForm),
      })
      if (response.ok) {
        toast({ title: "Menu item updated successfully" })
        setMenuForm({ name: "", description: "", price: 0, category: "", image: "", available: true })
        setMenuDialog(false)
        setEditingItem(null)
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error updating menu item", variant: "destructive" })
    }
  }

  const deleteMenuItem = async (id: string) => {
    try {
      const response = await fetch(api.menuItem(id), {
        method: "DELETE",
      })
      if (response.ok) {
        toast({ title: "Menu item deleted successfully" })
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error deleting menu item", variant: "destructive" })
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(api.orderStatus(orderId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        toast({ title: "Order status updated successfully" })
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error updating order status", variant: "destructive" })
    }
  }

  const createPaymentMethod = async () => {
    try {
      const response = await fetch(api.paymentMethods, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentForm),
      })
      if (response.ok) {
        toast({ title: "Payment method created successfully" })
        setPaymentForm({ bankName: "", accountNumber: "" })
        setPaymentDialog(false)
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error creating payment method", variant: "destructive" })
    }
  }

  const deletePaymentMethod = async (id: string) => {
    try {
      const response = await fetch(api.paymentMethod(id), {
        method: "DELETE",
      })
      if (response.ok) {
        toast({ title: "Payment method deleted successfully" })
        fetchAllData()
      }
    } catch (error) {
      toast({ title: "Error deleting payment method", variant: "destructive" })
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch(api.menuUpload, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        setMenuForm({ ...menuForm, image: data.path })
        toast({ title: "Image uploaded successfully" })
      }
    } catch (error) {
      toast({ title: "Error uploading image", variant: "destructive" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "preparing":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "delivered":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "users", label: "Users", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
  ]

  const MobileNavigation = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-orange-600">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="bg-orange-500 p-4">
          <h2 className="text-lg font-bold text-white">Mesaqa Admin</h2>
        </div>
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "hover:bg-orange-50 hover:text-orange-600"
                  }`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-orange-600">Mesaqa Admin</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-orange-500 shadow-sm border-b md:hidden">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <MobileNavigation />
            <h1 className="text-lg font-bold text-white">Mesaqa Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-orange-600">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-orange-500 shadow-sm border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">Mesaqa Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-orange-100">Welcome, {admin.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-orange-200 text-orange-100 hover:bg-orange-400 hover:text-white bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-6 bg-orange-50 h-12">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Menu</p>
                    <p className="text-2xl font-bold">{menuItems.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">#{order._id.slice(-6)}</p>
                          <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.user?.name || order.user?.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{order.items.length} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-orange-600">Categories</h2>
              <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingItem(null)
                      setCategoryForm({ name: "", description: "" })
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit Category" : "Add New Category"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={editingItem ? updateCategory : createCategory}
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                    >
                      {editingItem ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(category)
                          setCategoryForm({ name: category.name, description: category.description })
                          setCategoryDialog(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteCategory(category._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description || "No description"}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-orange-600">Menu Items</h2>
              <Dialog open={menuDialog} onOpenChange={setMenuDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingItem(null)
                      setMenuForm({ name: "", description: "", price: 0, category: "", image: "", available: true })
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={menuForm.name}
                          onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          value={menuForm.price}
                          onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={menuForm.description}
                        onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={menuForm.category}
                        onValueChange={(value) => setMenuForm({ ...menuForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                      />
                      {menuForm.image && (
                        <img
                          src={api.image(menuForm.image) || "/placeholder.svg"}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded mx-auto"
                        />
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={editingItem ? updateMenuItem : createMenuItem}
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                    >
                      {editingItem ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  {item.image && (
                    <div className="aspect-video relative">
                      <img
                        src={api.image(item.image) || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.category?.name}</p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description || "No description"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-600">${item.price}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item)
                            setMenuForm({
                              name: item.name,
                              description: item.description,
                              price: item.price,
                              category: item.category?._id || "",
                              image: item.image,
                              available: item.available,
                            })
                            setMenuDialog(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteMenuItem(item._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-orange-600">Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Order #{order._id.slice(-6)}</h3>
                        <Badge className={`${getStatusColor(order.status)} text-xs`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.user?.name || order.user?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{order.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Items:</p>
                        {order.items.map((item, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            {item.menu?.name} x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order._id, value)}>
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      {order.paymentReceipt && (
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto bg-transparent">
                          <a href={api.image(order.paymentReceipt)} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-2" />
                            Receipt
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold text-orange-600">Users</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <Card key={user._id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{user.name || "Anonymous User"}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-orange-600">Payment Methods</h2>
              <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setPaymentForm({ bankName: "", accountNumber: "" })
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent className="mx-4 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Payment Method</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={paymentForm.accountNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={createPaymentMethod}
                      className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map((method) => (
                <Card key={method._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{method.bankName}</h3>
                        <p className="text-sm text-muted-foreground">{method.accountNumber}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => deletePaymentMethod(method._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  )
}
