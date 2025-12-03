/**
 * Company/User Profile Model
 * Represents company information from Driver API
 */

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
