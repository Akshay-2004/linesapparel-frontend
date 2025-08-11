'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/useApi';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  Truck,
  Eye,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: string;
    image?: {
      url: string;
      altText: string;
    };
  };
  product: {
    id: string;
    handle: string;
    title: string;
  };
}

interface Order {
  id: string;
  name: string;
  createdAt: string;
  totalPrice: string;
  financialStatus: string;
  fulfillmentStatus: string;
  currencyCode: string;
  processedAt: string;
  lineItems: {
    edges: Array<{
      node: OrderItem;
    }>;
  };
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
}

interface OrdersResponse {
  orders: Order[];
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  total_count: number;
  current_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export default function OrdersPage() {
  const router = useRouter();
  const { data: ordersData, error, loading, fetchData } = useApi<OrdersResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  const loadOrders = async (page: number = 1) => {
    try {
      await fetchData(`/shopify/orders/user/my-orders?page=${page}&limit=10`);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'authorized':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refunded':
      case 'voided':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'fulfilled':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unfulfilled':
      case 'partial':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(parseFloat(price));
  };

  if (loading && !ordersData) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              My Orders
            </h1>
            <p className="text-gray-600 mt-1">
              View and track your purchase history
            </p>
          </div>
        </div>
      </div>

      {/* Orders Summary */}
      {ordersData && (
        <Card className="shadow-lg border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{ordersData.total_count}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ordersData.customer?.firstName} {ordersData.customer?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{ordersData.customer?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Failed to load orders</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {ordersData && ordersData.orders.length > 0 ? (
        <div className="space-y-4">
          {ordersData.orders.map((order) => (
            <Card key={order.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span>Order {order.name}</span>
                  </CardTitle>                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.financialStatus)}>
                      {order.financialStatus}
                    </Badge>
                    {order.fulfillmentStatus && (
                      <Badge className={getStatusColor(order.fulfillmentStatus)}>
                        {order.fulfillmentStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Ordered:</span>
                      <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(order.totalPrice, order.currencyCode)}
                      </span>
                    </div>

                    {order.shippingAddress && (
                      <div className="flex items-start space-x-2">
                        <Truck className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <span className="text-gray-500">Shipping to:</span>
                          <p className="font-medium">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </p>
                          <p className="text-gray-600">
                            {order.shippingAddress.address1}, {order.shippingAddress.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {order.lineItems.edges.map(({ node: item }) => (
                        <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          {item.variant.image && (
                            <img
                              src={item.variant.image.url}
                              alt={item.variant.image.altText || item.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.variant.title}</p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.variant.price, order.currencyCode)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}          {/* Pagination */}
          {ordersData.total_pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button 
                variant="outline"
                disabled={!ordersData.has_previous_page || currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Page {ordersData.current_page} of {ordersData.total_pages}
                </span>
                <span className="text-sm text-gray-500">
                  ({ordersData.total_count} total orders)
                </span>
              </div>
              
              <Button 
                variant="outline"
                disabled={!ordersData.has_next_page || currentPage === ordersData.total_pages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          )}
        </div>
      ) : ordersData && ordersData.orders.length === 0 ? (
        /* Empty State */
        <Card className="shadow-lg">
          <CardContent className="p-12">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button onClick={() => router.push('/')}>
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}