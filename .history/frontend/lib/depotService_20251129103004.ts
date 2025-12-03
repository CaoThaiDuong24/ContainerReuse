/**
 * Depot Service - API calls for Depot management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Depot {
  id: string;
  name: string;
  location: string;
  address: string;
  image: string;
  containerCount: number;
  capacity: number;
  status: 'active' | 'inactive';
  province: string;
}

export interface DepotStatistics {
  totalCapacity: number;
  totalContainers: number;
  activeDepots: number;
  utilizationRate: number;
  totalDepots: number;
  availableSpace: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Fetch all depots with optional filters
 */
export async function fetchDepots(params?: {
  province?: string;
  search?: string;
  status?: string;
}): Promise<ApiResponse<Depot[]>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.province && params.province !== 'all') {
      queryParams.append('province', params.province);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }

    const url = `${API_BASE_URL}/api/iContainerHub_Depot${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    console.log('Fetching depots:', url);

    const response = await fetch(url, {
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
    console.error('Error fetching depots:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch depot by ID
 */
export async function fetchDepotById(id: string): Promise<ApiResponse<Depot>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot/${id}`, {
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
    console.error('Error fetching depot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch depot statistics
 */
export async function fetchDepotStatistics(): Promise<ApiResponse<DepotStatistics>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot/statistics`, {
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
    console.error('Error fetching statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch all provinces
 */
export async function fetchProvinces(): Promise<ApiResponse<string[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot/provinces`, {
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
    console.error('Error fetching provinces:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create new depot
 */
export async function createDepot(depot: Omit<Depot, 'id'>): Promise<ApiResponse<Depot>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(depot),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating depot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update depot
 */
export async function updateDepot(id: string, depot: Partial<Depot>): Promise<ApiResponse<Depot>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(depot),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating depot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete depot
 */
export async function deleteDepot(id: string): Promise<ApiResponse<Depot>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_Depot/${id}`, {
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
    console.error('Error deleting depot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
