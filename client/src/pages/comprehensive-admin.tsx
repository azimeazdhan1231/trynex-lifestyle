import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { PlusCircle, Eye, Edit, Trash2, Package, ShoppingCart, Users, BarChart3, Upload, ImageIcon } from 'lucide-react';
import type { Order, Product, InsertProduct } from '@shared/schema';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export default function ComprehensiveAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'admin123' });
  const [productForm, setProductForm] = useState<Partial<InsertProduct>>({
    name: '',
    nameBn: '',
    description: '',
    descriptionBn: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    features: [],
    featuresBn: [],
    image: '/api/placeholder/300/300',
    images: ['/api/placeholder/300/300'],
    inStock: true,
    isCustomizable: false,
    isFeatured: false,
    tags: [],
    specifications: {}
  });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-login for development
  useEffect(() => {
    if (!isLoggedIn) {
      handleLogin();
    }
  }, []);

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
        title: "Admin Login Successful",
        description: "Welcome to the admin panel",
      });
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    enabled: isLoggedIn,
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: isLoggedIn,
  });

  // Create/Update product mutation
  const saveProductMutation = useMutation({
    mutationFn: async (product: Partial<InsertProduct>) => {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      return apiRequest(method, url, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      resetProductForm();
      toast({
        title: "Success!",
        description: editingProduct ? "Product updated" : "Product created",
      });
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "Failed to save product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Success!",
        description: "Product deleted",
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
        title: "Success!",
        description: "Order status updated",
      });
    },
  });

  const handleLogin = () => {
    loginMutation.mutate(loginForm);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      nameBn: '',
      description: '',
      descriptionBn: '',
      price: '',
      originalPrice: '',
      category: '',
      subcategory: '',
      features: [],
      featuresBn: [],
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300'],
      inStock: true,
      isCustomizable: false,
      isFeatured: false,
      tags: [],
      specifications: {}
    });
    setEditingProduct(null);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      nameBn: product.nameBn,
      description: product.description || '',
      descriptionBn: product.descriptionBn || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      subcategory: product.subcategory || '',
      features: product.features || [],
      featuresBn: product.featuresBn || [],
      image: product.image || '/api/placeholder/300/300',
      images: product.images || ['/api/placeholder/300/300'],
      inStock: product.inStock,
      isCustomizable: product.isCustomizable,
      isFeatured: product.isFeatured,
      tags: product.tags || [],
      specifications: product.specifications || {}
    });
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = () => {
    saveProductMutation.mutate(productForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setProductForm(prev => ({ 
        ...prev, 
        image: result.filePath,
        images: [result.filePath]
      }));
      
      toast({
        title: "Success!",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="admin-login-page">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                data-testid="input-username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                data-testid="input-password"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Default: admin / admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trynex Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {adminUser?.username}</span>
            <Button 
              variant="outline" 
              onClick={() => setIsLoggedIn(false)}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ৳{orders.reduce((sum, order) => sum + parseFloat(order.total || '0'), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Product Management</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetProductForm} data-testid="button-add-product">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Product Name (English)</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                          data-testid="input-product-name"
                        />
                      </div>
                      <div>
                        <Label>Product Name (Bengali)</Label>
                        <Input
                          value={productForm.nameBn}
                          onChange={(e) => setProductForm(prev => ({ ...prev, nameBn: e.target.value }))}
                          data-testid="input-product-name-bn"
                        />
                      </div>
                      <div>
                        <Label>Price (৳)</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                          data-testid="input-product-price"
                        />
                      </div>
                      <div>
                        <Label>Original Price (৳)</Label>
                        <Input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                          data-testid="input-product-original-price"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select 
                          value={productForm.category} 
                          onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mugs">Mugs</SelectItem>
                            <SelectItem value="tshirts">T-Shirts</SelectItem>
                            <SelectItem value="keychains">Keychains</SelectItem>
                            <SelectItem value="water-bottles">Water Bottles</SelectItem>
                            <SelectItem value="gift-for-him">Gift for Him</SelectItem>
                            <SelectItem value="gift-for-her">Gift for Her</SelectItem>
                            <SelectItem value="for-couple">For Couple</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Description (English)</Label>
                        <Textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                          data-testid="textarea-description"
                        />
                      </div>
                      <div>
                        <Label>Description (Bengali)</Label>
                        <Textarea
                          value={productForm.descriptionBn}
                          onChange={(e) => setProductForm(prev => ({ ...prev, descriptionBn: e.target.value }))}
                          data-testid="textarea-description-bn"
                        />
                      </div>
                      
                      <div>
                        <Label>Product Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={productForm.image} 
                              alt="Product preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={imageUploading}
                              data-testid="input-image-upload"
                            />
                            {imageUploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={productForm.inStock}
                            onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, inStock: checked }))}
                            data-testid="switch-in-stock"
                          />
                          <Label>In Stock</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={productForm.isFeatured}
                            onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, isFeatured: checked }))}
                            data-testid="switch-featured"
                          />
                          <Label>Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={productForm.isCustomizable}
                            onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, isCustomizable: checked }))}
                            data-testid="switch-customizable"
                          />
                          <Label>Customizable</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsProductDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveProduct}
                      disabled={saveProductMutation.isPending}
                      data-testid="button-save-product"
                    >
                      {saveProductMutation.isPending ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                {productsLoading ? (
                  <div className="text-center py-8">Loading products...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                          <TableCell>
                            <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.nameBn}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>৳{product.price}</TableCell>
                          <TableCell>
                            <Badge variant={product.inStock ? "default" : "destructive"}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditProduct(product)}
                                data-testid={`button-edit-${product.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteProductMutation.mutate(product.id)}
                                data-testid={`button-delete-${product.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order Management</h2>
            </div>

            <Card>
              <CardContent className="p-6">
                {ordersLoading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                          <TableCell className="font-mono text-sm">
                            {order.trackingId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-gray-500">{order.customerPhone}</p>
                            </div>
                          </TableCell>
                          <TableCell>৳{order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(status) => 
                                updateOrderStatusMutation.mutate({ orderId: order.id, status })
                              }
                            >
                              <SelectTrigger className="w-32" data-testid={`select-status-${order.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}