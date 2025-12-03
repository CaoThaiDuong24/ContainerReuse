/**
 * Company Service
 * Frontend service for company-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Company {
  id: string;
  code: string;
  name: string;
  taxCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  type?: string;
  rawApiData?: any;
}

export interface CompanyApiResponse {
  success: boolean;
  count: number;
  data: Company[];
  message?: string;
}

export interface SingleCompanyApiResponse {
  success: boolean;
  data: Company | null;
  message?: string;
}

/**
 * Fetch all companies from backend
 */
export async function getAllCompanies(): Promise<CompanyApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return {
      success: false,
      count: 0,
      data: [],
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch company by ID
 */
export async function getCompanyById(companyId: string): Promise<SingleCompanyApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Refresh company cache
 */
export async function refreshCompanies(): Promise<CompanyApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/companies/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing companies:', error);
    return {
      success: false,
      count: 0,
      data: [],
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
