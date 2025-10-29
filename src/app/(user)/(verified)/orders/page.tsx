'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrderService, Order, orderUtils } from '@/services/order.service';
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

export default function OrdersPage() {
  const router = useRouter();
  const { getUserOrders, loading, error } = useOrderService();
  const [ordersData, setOrdersData] = useState<{
    orders: Order[];
    customer: any;
    totalCount: number;
    pageInfo: any;
  } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    try {
      const data = await getUserOrders({ first: 10 });
      setOrdersData(data);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      toast.error(err.message || 'Failed to load orders');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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
                  <p className="text-2xl font-bold text-gray-900">{ordersData.totalCount}</p>
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
          {ordersData.orders.map((order) => {
            return (
              <Card key={order.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-gray-600" />
                      <span>Order {order.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={orderUtils.getStatusColor(order.financialStatus)}>
                        {order.financialStatus}
                      </Badge>
                      {order.fulfillmentStatus && (
                        <Badge className={orderUtils.getStatusColor(order.fulfillmentStatus)}>
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
                        <span className="text-sm font-medium">{orderUtils.formatDate(order.processedAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="text-lg font-bold text-green-600">
                          {orderUtils.formatCurrency(order.totalPriceV2.amount, order.totalPriceV2.currencyCode)}
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
                        {order.lineItems.edges.map(({ node: item }, index) => (
                          <div key={item.variant?.id || `${order.id}-item-${index}`} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            {item.variant?.image && (
                              <img
                                src={item.variant.image.url}
                                alt={item.variant.image.altText || item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-gray-500">{item.variant?.title || 'N/A'}</p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} × {item.variant?.priceV2 
                                  ? orderUtils.formatCurrency(item.variant.priceV2.amount, item.variant.priceV2.currencyCode)
                                  : 'N/A'
                                }
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
            );
          })}
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
  );
}
