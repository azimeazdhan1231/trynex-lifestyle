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
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Order, Product, InsertProduct } from '@shared/schema';

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export default function EnhancedAdmin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Auto-refresh orders every 10 seconds
  useEffect(() => {
    if (!isLoggedIn || !autoRefresh) return;
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isLoggedIn, autoRefresh, queryClient]);

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

  // Fetch orders with real-time updates
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    enabled: isLoggedIn,
    refetchInterval: autoRefresh ? 5000 : false, // Refetch every 5 seconds
    refetchIntervalInBackground: false,
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: isLoggedIn,
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest('PUT', `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "সফল!",
        description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      setIsOrderDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "ত্রুটি!",
        description: "অর্ডার স্ট্যাটাস আপডেট করতে পারা যায়নি",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'processing': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'অপেক্ষমান',
      confirmed: 'নিশ্চিত',
      processing: 'প্রস্তুত হচ্ছে',
      shipped: 'পাঠানো হয়েছে',
      delivered: 'ডেলিভার করা হয়েছে',
      cancelled: 'বাতিল',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('bn-BD');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              অ্যাডমিন লগইন
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Default: admin / admin123
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'লগইন হচ্ছে...' : 'লগইন'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trynex Admin</h1>
              <p className="text-sm text-gray-600">স্বাগতম, {adminUser?.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Auto Refresh:</span>
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  {autoRefresh ? "ON" : "OFF"}
                </Button>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">
              অর্ডার ({orders.length})
              {autoRefresh && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
            </TabsTrigger>
            <TabsTrigger value="products">প্রোডাক্ট</TabsTrigger>
            <TabsTrigger value="analytics">বিশ্লেষণ</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">অর্ডার ম্যানেজমেন্ট</h2>
                <Button onClick={() => refetchOrders()}>
                  <i className="fas fa-refresh mr-2"></i>
                  রিফ্রেশ
                </Button>
              </div>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                  <p className="mt-2 text-gray-600">অর্ডার লোড হচ্ছে...</p>
                </div>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">কোনো অর্ডার নেই</h3>
                    <p className="text-gray-500">এখনো কোনো অর্ডার আসেনি</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ট্র্যাকিং আইডি</TableHead>
                            <TableHead>কাস্টমার</TableHead>
                            <TableHead>মোট</TableHead>
                            <TableHead>স্ট্যাটাস</TableHead>
                            <TableHead>তারিখ</TableHead>
                            <TableHead>অ্যাকশন</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-mono text-sm">
                                {order.trackingId}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.customerName}</div>
                                  <div className="text-sm text-gray-500">{order.customerPhone}</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                ৳{order.total}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">
                                {formatDate(order.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsOrderDialogOpen(true);
                                  }}
                                >
                                  বিস্তারিত
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">প্রোডাক্ট ম্যানেজমেন্ট</h2>
              </div>

              {productsLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                  <p className="mt-2 text-gray-600">প্রোডাক্ট লোড হচ্ছে...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.nameBn}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">৳{product.price}</span>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? "স্টকে আছে" : "স্টকে নেই"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">মোট অর্ডার</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                    <i className="fas fa-shopping-cart text-2xl text-blue-500"></i>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">পেন্ডিং অর্ডার</p>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === 'pending').length}
                      </p>
                    </div>
                    <i className="fas fa-clock text-2xl text-yellow-500"></i>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ডেলিভার্ড</p>
                      <p className="text-2xl font-bold">
                        {orders.filter(o => o.status === 'delivered').length}
                      </p>
                    </div>
                    <i className="fas fa-check-circle text-2xl text-green-500"></i>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">মোট বিক্রয়</p>
                      <p className="text-2xl font-bold">
                        ৳{orders.reduce((sum, order) => sum + Number(order.total || 0), 0)}
                      </p>
                    </div>
                    <i className="fas fa-dollar-sign text-2xl text-green-600"></i>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>অর্ডার বিস্তারিত - {selectedOrder.trackingId}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>কাস্টমার তথ্য</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">নাম:</span>
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ফোন:</span>
                      <span className="font-medium">{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ইমেইল:</span>
                      <span className="font-medium">{selectedOrder.customerEmail ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ঠিকানা:</span>
                      <span className="font-medium">{selectedOrder.district}, {selectedOrder.thana}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>অর্ডার তথ্য</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">স্ট্যাটাস:</span>
                      <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">মোট:</span>
                      <span className="font-bold text-lg">৳{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">পেমেন্ট:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">তারিখ:</span>
                      <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Update */}
              <Card>
                <CardHeader>
                  <CardTitle>স্ট্যাটাস আপডেট</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <Button
                        key={status}
                        variant={selectedOrder.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateOrderStatusMutation.mutate({ orderId: selectedOrder.id, status })}
                        disabled={updateOrderStatusMutation.isPending}
                      >
                        {getStatusText(status)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}