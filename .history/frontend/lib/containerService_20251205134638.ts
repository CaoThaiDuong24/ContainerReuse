/**
 * Container Service - API calls for Container management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Container {
  id: string;
  containerId: string;
  size: string;  // Lấy động từ API: "20'", "40'", "45'"
  type: string;  // Lấy động từ API: "GP", "RF", "UT", "PC", "PF", "TN", etc.
  status: 'available' | 'in-use' | 'maintenance' | 'reserved';
  depotId: string;
  depotName: string;
  depotProvince?: string;
  owner: string;
  shippingLineId?: string;
  shippingLineName?: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspection: string;
  inDate: string;
  estimatedOutDate?: string;
  returnEmptyDate?: string;
  currentLocation?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Fetch all containers with optional filters
 */
export async function fetchContainers(params?: {
  depotId?: string;
  type?: string;
  size?: string;
  status?: string;
}): Promise<ApiResponse<Container[]>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.depotId) {
      queryParams.append('depotId', params.depotId);
    }
    if (params?.type && params.type !== 'all') {
      queryParams.append('type', params.type);
    }
    if (params?.size && params.size !== 'all') {
      queryParams.append('size', params.size);
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }

    const url = `${API_BASE_URL}/api/containers${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    console.log('Fetching containers:', url);

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
    console.error('Error fetching containers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch all reuse containers from GetListReUse_Now API
 */
export async function fetchReuseContainers(): Promise<ApiResponse<Container[]>> {
  try {
    const url = `${API_BASE_URL}/api/containers/reuse-now`;
    
    console.log('Fetching reuse containers:', url);

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 65000); // 65 seconds

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      const result = await response.json();
      console.log('Container data received:', result);
      
      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching reuse containers:', error);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout - API mất quá lâu để phản hồi. Vui lòng thử lại.',
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch container by ID
 */
export async function fetchContainerById(id: string): Promise<ApiResponse<Container>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/containers/${id}`, {
      method: 'GET',
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
    console.error('Error fetching container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch containers by depot ID
 */
export async function fetchContainersByDepotId(depotId: string): Promise<ApiResponse<Container[]>> {
  try {
    console.log('[ContainerService] ===== FETCHING CONTAINERS FOR DEPOT =====');
    console.log('[ContainerService] Target depot ID:', depotId, 'Type:', typeof depotId);
    
    const response = await fetchReuseContainers();
    
    if (!response.success || !response.data) {
      console.error('[ContainerService] Failed to fetch containers:', response.error);
      return response;
    }

    console.log('[ContainerService] Total containers from API:', response.data.length);
    
    // Filter containers by depotId on client side
    const filteredContainers = response.data.filter(
      (container: Container) => {
        const match = String(container.depotId) === String(depotId);
        if (match) {
          console.log('[ContainerService] ✅ MATCH FOUND:', container.containerId, 'depotId:', container.depotId);
        }
        return match;
      }
    );

    console.log('[ContainerService] ===== FILTER RESULT =====');
    console.log('[ContainerService] Filtered containers count:', filteredContainers.length);
    if (filteredContainers.length > 0) {
      console.log('[ContainerService] First matched container:', filteredContainers[0]);
    }

    return {
      success: true,
      data: filteredContainers,
      count: filteredContainers.length,
    };
  } catch (error) {
    console.error('Error fetching containers by depot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create new container
 */
export async function createContainer(container: Omit<Container, 'id'>): Promise<ApiResponse<Container>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/containers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(container),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update container
 */
export async function updateContainer(id: string, container: Partial<Container>): Promise<ApiResponse<Container>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/containers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(container),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete container
 */
export async function deleteContainer(id: string): Promise<ApiResponse<Container>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/containers/${id}`, {
      method: 'DELETE',
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
    console.error('Error deleting container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
