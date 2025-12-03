/**
 * Container Service - API calls for Container management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Container {
  id: string;
  containerId: string;
  size: '20ft' | '40ft' | '45ft';
  type: 'dry' | 'reefer' | 'opentop' | 'flatrack' | 'tank';
  status: 'available' | 'in-use' | 'maintenance' | 'reserved';
  depotId: string;
  depotName: string;
  owner: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspection: string;
  inDate: string;
  estimatedOutDate?: string;
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
 * Fetch all reuse containers with optional filters
 */
export async function fetchReuseContainers(params?: {
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

    const url = `${API_BASE_URL}/api/containers/reuse-now${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;
    
    console.log('Fetching reuse containers:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Container data received:', result);
    
    return result;
  } catch (error) {
    console.error('Error fetching reuse containers:', error);
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
    const response = await fetchReuseContainers({ depotId });
    
    if (!response.success || !response.data) {
      return response;
    }

    // Filter containers by depotId on client side as fallback
    const filteredContainers = response.data.filter(
      (container: Container) => container.depotId === depotId
    );

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
