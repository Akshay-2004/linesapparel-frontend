import { useApi } from '@/hooks/useApi';

interface OrderItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
    product: {
      id: string;
      handle: string;
      title: string;
    };
  } | null;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  address1?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  totalPriceV2: {
    amount: string;
    currencyCode: string;
  };
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: {
    edges: {
      node: OrderItem;
    }[];
  };
  shippingAddress?: ShippingAddress;
}

interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface OrdersResponse {
  orders: Order[];
  customer: Customer;
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

interface GetOrdersParams {
  first?: number;
  after?: string;
}

export function useOrderService() {
  const { fetchData, loading, error } = useApi<OrdersResponse>();

  const getUserOrders = async (params?: GetOrdersParams): Promise<OrdersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.first) {
      queryParams.append('limit', params.first.toString());
    }
    if (params?.after) {
      queryParams.append('after', params.after);
    }

    const url = `/shopify/orders/user/my-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const result = await fetchData(url, { 
      method: 'GET',
      timeout: 30000
    });
    
    if (!result) {
      throw new Error('Failed to fetch orders');
    }
    
    return result;
  };

  return {
    getUserOrders,
    loading,
    error
  };
}

/**
 * Utility functions for order formatting
 */
export const orderUtils = {
  /**
   * Format currency for display
   */
  formatCurrency(amount: string, currencyCode: string): string {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(numericAmount);
  },

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Get status color for order status
   */
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'fulfilled':
      case 'shipped':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'unfulfilled':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'refunded':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
};
