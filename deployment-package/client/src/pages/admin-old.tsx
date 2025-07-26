import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Order, Product, InsertProduct } from '@shared/schema';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [productForm, setProductForm] = useState<Partial<InsertProduct>>({
    name: '',
    nameBn: '',
    description: '',
    descriptionBn: '',
    price: '',
    category: '',
    features: [],
    image: '',
    inStock: true,
  });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/admin/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      setIsLoggedIn(true);
      setAdminUser(data.admin);
      toast({
        title: "সফল!",
        description: "অ্যাডমিন প্যানেলে স্বাগতম",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "ভুল ইউজারনেম বা পাসওয়ার্ড",
        variant: "destructive",
      });
    },
  });

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    enabled: isLoggedIn,
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: isLoggedIn,
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest('PUT', `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "সফল!",
        description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "অর্ডার আপডেট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    },
  });

  // Create/Update product mutation
  const productMutation = useMutation({
    mutationFn: async (productData: Partial<InsertProduct>) => {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await apiRequest(method, url, {
        ...productData,
        features: productData.features || [],
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        nameEn: '',
        description: '',
        descriptionEn: '',
        price: '',
        category: '',
        features: [],
        image: '',
        isActive: true,
      });
      toast({
        title: "সফল!",
        description: editingProduct ? "প্রোডাক্ট আপডেট হয়েছে" : "নতুন প্রোডাক্ট যোগ হয়েছে",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "প্রোডাক্ট সেভ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest('DELETE', `/api/admin/products/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "সফল!",
        description: "প্রোডাক্ট ডিলিট হয়েছে",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "প্রোডাক্ট ডিলিট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleOrderStatusUpdate = (orderId: string, status: string) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  const handleProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    productMutation.mutate(productForm);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      nameEn: product.nameEn,
      description: product.description,
      descriptionEn: product.descriptionEn,
      price: product.price,
      category: product.category,
      features: product.features as string[],
      image: product.image,
      isActive: product.isActive,
    });
    setIsProductDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">অ্যাডমিন লগইন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">ইউজারনেম</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'লগইন হচ্ছে...' : 'লগইন'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neutral">অ্যাডমিন প্যানেল</h1>
              <p className="text-gray-600">স্বাগতম, {adminUser?.username}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsLoggedIn(false);
                setAdminUser(null);
              }}
            >
              লগআউট
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">অর্ডার ম্যানেজমেন্ট</TabsTrigger>
            <TabsTrigger value="products">প্রোডাক্ট ম্যানেজমেন্ট</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>সকল অর্ডার</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
                  </div>
                ) : orders?.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">কোন অর্ডার নেই</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ট্র্যাকিং আইডি</TableHead>
                          <TableHead>কাস্টমার</TableHead>
                          <TableHead>ফোন</TableHead>
                          <TableHead>মোট পরিমাণ</TableHead>
                          <TableHead>স্ট্যাটাস</TableHead>
                          <TableHead>তারিখ</TableHead>
                          <TableHead>অ্যাকশন</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders?.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.trackingId}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.customerPhone}</TableCell>
                            <TableCell>৳{order.totalAmount}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status || 'pending')}>
                                {t(order.status || 'pending')}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.createdAt ? formatDate(order.createdAt.toString()) : 'N/A'}</TableCell>
                            <TableCell>
                              <Select
                                value={order.status || 'pending'}
                                onValueChange={(status) => handleOrderStatusUpdate(order.id, status)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
                                  <SelectItem value="confirmed">কনফার্ম</SelectItem>
                                  <SelectItem value="processing">প্রক্রিয়াধীন</SelectItem>
                                  <SelectItem value="ready">প্রস্তুত</SelectItem>
                                  <SelectItem value="shipped">পাঠানো হয়েছে</SelectItem>
                                  <SelectItem value="delivered">ডেলিভার হয়েছে</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>প্রোডাক্ট ম্যানেজমেন্ট</CardTitle>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingProduct(null)}>
                        <i className="fas fa-plus mr-2"></i>
                        নতুন প্রোডাক্ট
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যোগ করুন'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProductSave} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">নাম (বাংলা)</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="nameEn">নাম (ইংরেজি)</Label>
                            <Input
                              id="nameEn"
                              value={productForm.nameEn}
                              onChange={(e) => setProductForm(prev => ({ ...prev, nameEn: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">বর্ণনা (বাংলা)</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="descriptionEn">বর্ণনা (ইংরেজি)</Label>
                          <Textarea
                            id="descriptionEn"
                            value={productForm.descriptionEn}
                            onChange={(e) => setProductForm(prev => ({ ...prev, descriptionEn: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">দাম</Label>
                            <Input
                              id="price"
                              type="number"
                              value={productForm.price}
                              onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">ক্যাটেগরি</Label>
                            <Select
                              value={productForm.category}
                              onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">জেনারেল মগ</SelectItem>
                                <SelectItem value="love">লাভ মগ</SelectItem>
                                <SelectItem value="magic">ম্যাজিক মগ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="image">ইমেজ URL</Label>
                          <Input
                            id="image"
                            value={productForm.image}
                            onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="features">ফিচার (কমা দিয়ে আলাদা করুন)</Label>
                          <Textarea
                            id="features"
                            value={(productForm.features as string[])?.join(', ') || ''}
                            onChange={(e) => setProductForm(prev => ({ 
                              ...prev, 
                              features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                            }))}
                            placeholder="কাস্টম ডিজাইন, উন্নত মানের সিরামিক, দীর্ঘস্থায়ী প্রিন্ট"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsProductDialogOpen(false)}
                          >
                            বাতিল
                          </Button>
                          <Button type="submit" disabled={productMutation.isPending}>
                            {productMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                    <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
                  </div>
                ) : products?.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-box text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">কোন প্রোডাক্ট নেই</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.map((product) => (
                      <Card key={product.id}>
                        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {language === 'bn' ? product.name : product.nameEn}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {language === 'bn' ? product.description : product.descriptionEn}
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-primary">৳{product.price}</span>
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                            >
                              <i className="fas fa-edit mr-1"></i>
                              এডিট
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                              disabled={deleteProductMutation.isPending}
                            >
                              <i className="fas fa-trash mr-1"></i>
                              ডিলিট
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
