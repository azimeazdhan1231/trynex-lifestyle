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
  
  const { language } = useLanguage();
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

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (product: Partial<InsertProduct>) => {
      return apiRequest('POST', '/api/admin/products', product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      resetProductForm();
      toast({
        title: "সফল!",
        description: "প্রোডাক্ট তৈরি হয়েছে",
      });
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "প্রোডাক্ট তৈরি করতে ব্যর্থ",
        variant: "destructive",
      });
    },
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest('PUT', `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "সফল!",
        description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে",
      });
    },
  });

  const resetProductForm = () => {
    setProductForm({
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
    setEditingProduct(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(productForm);
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      nameBn: product.nameBn || '',
      description: product.description || '',
      descriptionBn: product.descriptionBn || '',
      price: product.price || '',
      category: product.category || '',
      features: product.features || [],
      image: product.image || '',
      inStock: product.inStock !== false,
    });
    setIsProductDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: language === 'bn' ? 'অপেক্ষমাণ' : 'Pending', variant: 'secondary' as const },
      confirmed: { label: language === 'bn' ? 'কনফার্ম' : 'Confirmed', variant: 'default' as const },
      processing: { label: language === 'bn' ? 'প্রক্রিয়াধীন' : 'Processing', variant: 'default' as const },
      ready: { label: language === 'bn' ? 'প্রস্তুত' : 'Ready', variant: 'default' as const },
      shipped: { label: language === 'bn' ? 'পাঠানো হয়েছে' : 'Shipped', variant: 'default' as const },
      delivered: { label: language === 'bn' ? 'ডেলিভার হয়েছে' : 'Delivered', variant: 'default' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'লগইন হচ্ছে...' : 'লগইন'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-600">স্বাগতম, {adminUser?.username}</p>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">অর্ডার</TabsTrigger>
            <TabsTrigger value="products">প্রোডাক্ট</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>সব অর্ডার</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2">লোড হচ্ছে...</p>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ট্র্যাকিং ID</TableHead>
                        <TableHead>কাস্টমার</TableHead>
                        <TableHead>ফোন</TableHead>
                        <TableHead>মোট</TableHead>
                        <TableHead>স্ট্যাটাস</TableHead>
                        <TableHead>অ্যাকশন</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">{order.trackingId}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.customerPhone}</TableCell>
                          <TableCell>৳{order.total}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(status) => 
                                updateOrderStatusMutation.mutate({ orderId: order.id, status })
                              }
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
                ) : (
                  <div className="text-center py-8">
                    <p>কোন অর্ডার পাওয়া যায়নি</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">প্রোডাক্ট ম্যানেজমেন্ট</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetProductForm}>নতুন প্রোডাক্ট যোগ করুন</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'প্রোডাক্ট এডিট' : 'নতুন প্রোডাক্ট'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">নাম (ইংরেজি)</Label>
                        <Input
                          id="name"
                          value={productForm.name || ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameBn">নাম (বাংলা)</Label>
                        <Input
                          id="nameBn"
                          value={productForm.nameBn || ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, nameBn: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">বিবরণ (ইংরেজি)</Label>
                      <Textarea
                        id="description"
                        value={productForm.description || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descriptionBn">বিবরণ (বাংলা)</Label>
                      <Textarea
                        id="descriptionBn"
                        value={productForm.descriptionBn || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, descriptionBn: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">দাম</Label>
                        <Input
                          id="price"
                          value={productForm.price || ''}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">ক্যাটেগরি</Label>
                        <Select
                          value={productForm.category || ''}
                          onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mugs">মগ</SelectItem>
                            <SelectItem value="tshirts">টি-শার্ট</SelectItem>
                            <SelectItem value="keychains">কিচেইন</SelectItem>
                            <SelectItem value="water-bottles">ওয়াটার বোতল</SelectItem>
                            <SelectItem value="accessories">এক্সেসরিজ</SelectItem>
                            <SelectItem value="home-decor">হোম ডেকোর</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="image">ইমেজ URL</Label>
                      <Input
                        id="image"
                        value={productForm.image || ''}
                        onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="/api/placeholder/300/300"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsProductDialogOpen(false)}
                      >
                        বাতিল
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createProductMutation.isPending}
                      >
                        {createProductMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>সব প্রোডাক্ট</CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2">লোড হচ্ছে...</p>
                  </div>
                ) : products && products.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>নাম</TableHead>
                        <TableHead>ক্যাটেগরি</TableHead>
                        <TableHead>দাম</TableHead>
                        <TableHead>স্ট্যাটাস</TableHead>
                        <TableHead>অ্যাকশন</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{product.name}</div>
                              <div className="text-sm text-gray-600">{product.nameBn}</div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>৳{product.price}</TableCell>
                          <TableCell>
                            <Badge variant={product.inStock ? "default" : "secondary"}>
                              {product.inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => editProduct(product)}
                            >
                              এডিট
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p>কোন প্রোডাক্ট পাওয়া যায়নি</p>
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