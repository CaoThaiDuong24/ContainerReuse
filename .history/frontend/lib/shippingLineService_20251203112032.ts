/**
 * Shipping Line Service
 * Frontend service for managing shipping line (hãng tàu) operations
 */

export interface ShippingLine {
  id: string;
  code: string;              // Mã hãng tàu
  name: string;              // Tên hãng tàu
  fullName: string;          // Tên đầy đủ
  scacCode?: string;         // Standard Carrier Alpha Code
  country?: string;          // Quốc gia
  website?: string;          // Website
  email?: string;            // Email liên hệ
  phone?: string;            // Số điện thoại
  address?: string;          // Địa chỉ
  taxCode?: string;          // Mã số thuế
  logo?: string;             // Logo path
  colorTemplate?: string;    // Màu template
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingLineStatistics {
  total: number;
  active: number;
  inactive: number;
  byCountry: Record<string, number>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get all shipping lines with optional filters
 */
export async function getShippingLines(params?: {
  status?: 'active' | 'inactive';
  country?: string;
  search?: string;
}): Promise<{ success: boolean; count: number; data: ShippingLine[] }> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.search) queryParams.append('search', params.search);
    
    const url = `${API_BASE_URL}/api/iContainerHub_HangTau${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping lines: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching shipping lines:', error);
    throw error;
  }
}

/**
 * Get shipping line by ID
 */
export async function getShippingLineById(id: string): Promise<{ success: boolean; data: ShippingLine }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping line: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching shipping line by ID:', error);
    throw error;
  }
}

/**
 * Get shipping line by code
 */
export async function getShippingLineByCode(code: string): Promise<{ success: boolean; data: ShippingLine }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/code/${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping line: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching shipping line by code:', error);
    throw error;
  }
}

/**
 * Search shipping lines
 */
export async function searchShippingLines(query: string): Promise<{ success: boolean; count: number; data: ShippingLine[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search shipping lines: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching shipping lines:', error);
    throw error;
  }
}

/**
 * Get shipping line statistics
 */
export async function getShippingLineStatistics(): Promise<{ success: boolean; data: ShippingLineStatistics }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping line statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching shipping line statistics:', error);
    throw error;
  }
}

/**
 * Get list of countries
 */
export async function getCountries(): Promise<{ success: boolean; count: number; data: string[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/countries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
}

/**
 * Refresh shipping line data (clear cache)
 */
export async function refreshShippingLines(): Promise<{ success: boolean; message: string; count: number; data: ShippingLine[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh shipping lines: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing shipping lines:', error);
    throw error;
  }
}

/**
 * Create new shipping line
 */
export async function createShippingLine(data: Partial<ShippingLine>): Promise<{ success: boolean; message: string; data: ShippingLine }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create shipping line: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating shipping line:', error);
    throw error;
  }
}

/**
 * Update shipping line
 */
export async function updateShippingLine(id: string, data: Partial<ShippingLine>): Promise<{ success: boolean; message: string; data: ShippingLine }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update shipping line: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating shipping line:', error);
    throw error;
  }
}

/**
 * Delete shipping line
 */
export async function deleteShippingLine(id: string): Promise<{ success: boolean; message: string; data: { id: string } }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/iContainerHub_HangTau/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete shipping line: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting shipping line:', error);
    throw error;
  }
}
