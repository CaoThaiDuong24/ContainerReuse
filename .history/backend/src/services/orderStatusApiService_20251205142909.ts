import { BaseApiService } from './baseApiService';

interface OrderStatus {
  id: string;
  code: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * Service for managing order status data from external API
 */
class OrderStatusApiService extends BaseApiService {
  private cache: {
    data: OrderStatus[] | null;
    timestamp: number;
  } = {
    data: null,
    timestamp: 0
  };

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  /**
   * Fetch order status list from external API
   * Uses GetList_TrangThaiDonHang endpoint
   */
  async fetchOrderStatuses(): Promise<OrderStatus[]> {
    try {
      // Check cache first
      if (this.cache.data && (Date.now() - this.cache.timestamp < this.CACHE_DURATION)) {
        console.log('✨ Returning cached order status data');
        return this.cache.data;
      }

      // Get token if needed
      if (!this.token || !this.reqtime) {
        const tokenSuccess = await this.getToken('GetList_TrangThaiDonHang');
        if (!tokenSuccess) {
          throw new Error('Failed to get authentication token');
        }
      }

      console.log('📡 Fetching order statuses from API...');
      console.log(`URL: ${this.apiUrl}/api/data/process/GetList_TrangThaiDonHang`);

      const response = await this.axiosInstance.post('/api/data/process/GetList_TrangThaiDonHang', {
        reqid: 'GetList_TrangThaiDonHang',
        token: this.token,
        reqtime: this.reqtime,
        data: {
          appversion: '2023'
        }
      }, {
        timeout: 30000 // 30 second timeout
      });

      if (response.data && response.data.data) {
        console.log('✅ Order statuses retrieved successfully');
        console.log('📊 Count:', response.data.data.length);

        // Transform API data to our format
        const orderStatuses = this.transformOrderStatusData(response.data.data);

        // Update cache
        this.cache = {
          data: orderStatuses,
          timestamp: Date.now()
        };

        return orderStatuses;
      } else {
        console.error('❌ Invalid response format from API');
        return [];
      }
    } catch (error: any) {
      console.error('❌ Error fetching order statuses:', error.message);
      
      // If token expired, try once more with new token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('🔄 Token expired, retrying with new token...');
        this.token = null;
        this.reqtime = null;
        
        const tokenSuccess = await this.getToken('GetList_TrangThaiDonHang');
        if (tokenSuccess) {
          return this.fetchOrderStatuses();
        }
      }
      
      return [];
    }
  }

  /**
   * Transform API data to OrderStatus format
   */
  private transformOrderStatusData(apiData: any[]): OrderStatus[] {
    if (!Array.isArray(apiData)) {
      console.warn('⚠️ API data is not an array');
      return [];
    }

    return apiData.map(item => {
      // Helper function to get value from API field
      const getValue = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'object') {
          return field.v !== undefined ? field.v : (field.r !== undefined ? field.r : '');
        }
        return String(field);
      };

      const id = getValue(item.ID) || getValue(item.MaTrangThai) || '';
      const code = getValue(item.MaTrangThai) || getValue(item.Code) || '';
      const name = getValue(item.TenTrangThai) || getValue(item.Name) || getValue(item.Ten) || '';
      const description = getValue(item.MoTa) || getValue(item.Description) || '';
      
      // Define colors based on status name/code for better UI
      let color = '#6B7280'; // default gray
      let icon = '📦';
      
      const nameLower = name.toLowerCase();
      const codeLower = code.toLowerCase();
      
      if (nameLower.includes('chờ') || nameLower.includes('pending') || codeLower.includes('pending')) {
        color = '#F59E0B'; // amber
        icon = '⏳';
      } else if (nameLower.includes('đã xác nhận') || nameLower.includes('confirmed') || codeLower.includes('confirmed')) {
        color = '#3B82F6'; // blue
        icon = '✅';
      } else if (nameLower.includes('đang') || nameLower.includes('processing') || codeLower.includes('processing')) {
        color = '#8B5CF6'; // purple
        icon = '🔄';
      } else if (nameLower.includes('hoàn thành') || nameLower.includes('completed') || codeLower.includes('completed')) {
        color = '#10B981'; // green
        icon = '✔️';
      } else if (nameLower.includes('hủy') || nameLower.includes('cancel') || codeLower.includes('cancel')) {
        color = '#EF4444'; // red
        icon = '❌';
      } else if (nameLower.includes('trả') || nameLower.includes('return') || codeLower.includes('return')) {
        color = '#06B6D4'; // cyan
        icon = '↩️';
      } else if (nameLower.includes('xuất') || nameLower.includes('out') || codeLower.includes('out')) {
        color = '#14B8A6'; // teal
        icon = '📤';
      } else if (nameLower.includes('nhập') || nameLower.includes('in') || codeLower.includes('in')) {
        color = '#8B5CF6'; // violet
        icon = '📥';
      }

      return {
        id,
        code,
        name,
        description,
        color,
        icon
      };
    });
  }

  /**
   * Get a specific order status by ID or code
   */
  async getOrderStatusById(idOrCode: string): Promise<OrderStatus | null> {
    const statuses = await this.fetchOrderStatuses();
    return statuses.find(s => s.id === idOrCode || s.code === idOrCode) || null;
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cache = {
      data: null,
      timestamp: 0
    };
    console.log('🗑️ Order status cache cleared');
  }
}

// Export singleton instance
const orderStatusApiService = new OrderStatusApiService();
export default orderStatusApiService;
