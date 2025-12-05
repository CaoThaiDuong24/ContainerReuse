const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface OrderStatus {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface OrderStatusResponse {
  success: boolean;
  message: string;
  count?: number;
  data: OrderStatus[];
}

export interface SingleOrderStatusResponse {
  success: boolean;
  message?: string;
  data: OrderStatus;
}

/**
 * Get all order statuses
 */
export async function getOrderStatuses(): Promise<OrderStatus[]> {
  try {
    const response = await fetch(`${API_URL}/api/order-statuses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order statuses: ${response.statusText}`);
    }

    const result: OrderStatusResponse = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('API returned error:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    return [];
  }
}

/**
 * Get order status by ID or code
 */
export async function getOrderStatusById(id: string): Promise<OrderStatus | null> {
  try {
    const response = await fetch(`${API_URL}/api/order-statuses/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch order status: ${response.statusText}`);
    }

    const result: SingleOrderStatusResponse = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
    return null;
  }
}

/**
 * Clear order status cache
 */
export async function clearOrderStatusCache(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/order-statuses/clear-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to clear cache: ${response.statusText}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error clearing order status cache:', error);
    return false;
  }
}

// Helper function to get status color class for Tailwind
export function getOrderStatusColorClass(status: OrderStatus | null): string {
  if (!status || !status.color) return 'bg-gray-100 text-gray-800';
  
  const colorMap: Record<string, string> = {
    '#F59E0B': 'bg-amber-100 text-amber-800 border-amber-300',
    '#3B82F6': 'bg-blue-100 text-blue-800 border-blue-300',
    '#8B5CF6': 'bg-purple-100 text-purple-800 border-purple-300',
    '#10B981': 'bg-green-100 text-green-800 border-green-300',
    '#EF4444': 'bg-red-100 text-red-800 border-red-300',
    '#06B6D4': 'bg-cyan-100 text-cyan-800 border-cyan-300',
    '#14B8A6': 'bg-teal-100 text-teal-800 border-teal-300',
    '#6B7280': 'bg-gray-100 text-gray-800 border-gray-300'
  };
  
  return colorMap[status.color] || 'bg-gray-100 text-gray-800 border-gray-300';
}
