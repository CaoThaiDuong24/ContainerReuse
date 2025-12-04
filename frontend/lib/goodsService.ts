/**
 * Goods Service - API calls for Goods management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Goods {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Fetch all goods with optional filters
 */
export async function fetchGoods(params?: {
  status?: 'active' | 'inactive';
  search?: string;
}): Promise<ApiResponse<Goods[]>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${API_BASE_URL}/api/goods${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    console.log('Fetching goods:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching goods:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch only active goods
 */
export async function fetchActiveGoods(): Promise<ApiResponse<Goods[]>> {
  try {
    const url = `${API_BASE_URL}/api/goods/active`;
    
    console.log('Fetching active goods:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching active goods:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch goods by ID
 */
export async function fetchGoodsById(id: string): Promise<ApiResponse<Goods>> {
  try {
    const url = `${API_BASE_URL}/api/goods/${id}`;
    
    console.log('Fetching goods by ID:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching goods by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch goods by code
 */
export async function fetchGoodsByCode(code: string): Promise<ApiResponse<Goods>> {
  try {
    const url = `${API_BASE_URL}/api/goods/code/${code}`;
    
    console.log('Fetching goods by code:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching goods by code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Search goods
 */
export async function searchGoods(searchTerm: string): Promise<ApiResponse<Goods[]>> {
  try {
    const url = `${API_BASE_URL}/api/goods/search?q=${encodeURIComponent(searchTerm)}`;
    
    console.log('Searching goods:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error searching goods:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Refresh goods cache
 */
export async function refreshGoodsCache(): Promise<ApiResponse<Goods[]>> {
  try {
    const url = `${API_BASE_URL}/api/goods/refresh`;
    
    console.log('Refreshing goods cache:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error refreshing goods cache:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get goods statistics
 */
export async function getGoodsStatistics(): Promise<ApiResponse<{
  total: number;
  active: number;
  inactive: number;
  cache: any;
}>> {
  try {
    const url = `${API_BASE_URL}/api/goods/statistics`;
    
    console.log('Fetching goods statistics:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching goods statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
