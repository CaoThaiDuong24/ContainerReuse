/**
 * Location Service - API calls for Location/City/Province management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Location {
  code: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Fetch all locations (provinces/cities)
 */
export async function fetchLocations(): Promise<ApiResponse<Location[]>> {
  try {
    console.log('📡 Fetching locations from API...');
    const url = `${API_BASE_URL}/api/locations`;

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
    console.log(`✅ Fetched ${result.count || 0} locations`);
    return result;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch location name by code
 */
export async function fetchLocationByCode(code: string): Promise<ApiResponse<Location>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/locations/${code}`, {
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
    console.error('Error fetching location by code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Refresh location cache
 */
export async function refreshLocationCache(): Promise<ApiResponse<Location[]>> {
  try {
    console.log('🔄 Refreshing location cache...');
    const response = await fetch(`${API_BASE_URL}/api/locations/refresh`, {
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
    console.log(`✅ Location cache refreshed, ${result.count || 0} locations`);
    return result;
  } catch (error) {
    console.error('Error refreshing location cache:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get province names only (for UI display)
 */
export async function fetchProvinceNames(): Promise<string[]> {
  try {
    const response = await fetchLocations();
    if (response.success && response.data) {
      return response.data.map(loc => loc.name).sort();
    }
    return [];
  } catch (error) {
    console.error('Error fetching province names:', error);
    return [];
  }
}
