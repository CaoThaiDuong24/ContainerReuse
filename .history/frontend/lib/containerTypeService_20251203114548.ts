/**
 * Container Type Service - API calls for Container Type management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ContainerType {
  id: string;
  name: string;
  code: string;
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
 * Fetch all container types with optional filters
 */
export async function fetchContainerTypes(params?: {
  status?: 'active' | 'inactive';
  search?: string;
}): Promise<ApiResponse<ContainerType[]>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${API_BASE_URL}/api/container-types${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    console.log('Fetching container types:', url);

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
    console.error('Error fetching container types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch only active container types
 */
export async function fetchActiveContainerTypes(): Promise<ApiResponse<ContainerType[]>> {
  try {
    const url = `${API_BASE_URL}/api/container-types/active`;
    
    console.log('Fetching active container types:', url);

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
    console.error('Error fetching active container types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch container type by ID
 */
export async function fetchContainerTypeById(id: string): Promise<ApiResponse<ContainerType>> {
  try {
    const url = `${API_BASE_URL}/api/container-types/${id}`;
    
    console.log('Fetching container type by ID:', url);

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
    console.error('Error fetching container type by ID:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch container type by code
 */
export async function fetchContainerTypeByCode(code: string): Promise<ApiResponse<ContainerType>> {
  try {
    const url = `${API_BASE_URL}/api/container-types/code/${code}`;
    
    console.log('Fetching container type by code:', url);

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
    console.error('Error fetching container type by code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Search container types
 */
export async function searchContainerTypes(searchTerm: string): Promise<ApiResponse<ContainerType[]>> {
  try {
    const url = `${API_BASE_URL}/api/container-types/search?q=${encodeURIComponent(searchTerm)}`;
    
    console.log('Searching container types:', url);

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
    console.error('Error searching container types:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Refresh container types cache
 */
export async function refreshContainerTypesCache(): Promise<ApiResponse<ContainerType[]>> {
  try {
    const url = `${API_BASE_URL}/api/container-types/refresh`;
    
    console.log('Refreshing container types cache:', url);

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
    console.error('Error refreshing container types cache:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get container types statistics
 */
export async function getContainerTypesStatistics(): Promise<ApiResponse<{
  total: number;
  active: number;
  inactive: number;
  cache: any;
}>> {
  try {
    const url = `${API_BASE_URL}/api/container-types/statistics`;
    
    console.log('Fetching container types statistics:', url);

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
    console.error('Error fetching container types statistics:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
