/**
 * Vehicle Service
 * Frontend service for managing vehicle (xe) operations
 */

export interface Vehicle {
  id: string;                  // Vehicle ID
  vehiclePlate: string;        // Biển số xe
  transportCompanyId: string;  // ID đơn vị vận tải
  drivers: VehicleDriver[];    // Danh sách tài xế của xe này
}

export interface VehicleDriver {
  id: string;
  driverCode: string;
  driverName: string;
  fullName: string;
  phoneNumber?: string;
  idCard?: string;
  vehiclePlate?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get all vehicles for a specific transport company
 * @param transportCompanyId - ID of the transport company (DonViVanTaiID)
 */
export async function getVehiclesByCompany(
  transportCompanyId: string
): Promise<{ success: boolean; count: number; data: Vehicle[] }> {
  try {
    if (!transportCompanyId || transportCompanyId.trim() === '') {
      throw new Error('Transport company ID is required');
    }

    const url = `${API_BASE_URL}/api/vehicles/company/${transportCompanyId}`;
    
    console.log('🚗 Fetching vehicles from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ Vehicles fetched successfully:', result);
    
    return {
      success: true,
      count: result.count || 0,
      data: result.data || []
    };
  } catch (error) {
    console.error('❌ Error fetching vehicles:', error);
    return {
      success: false,
      count: 0,
      data: []
    };
  }
}

/**
 * Get drivers for a specific vehicle plate
 * @param vehiclePlate - Biển số xe
 * @param transportCompanyId - ID đơn vị vận tải
 */
export async function getDriversByVehicle(
  vehiclePlate: string,
  transportCompanyId: string
): Promise<{ success: boolean; count: number; data: VehicleDriver[] }> {
  try {
    if (!vehiclePlate || vehiclePlate.trim() === '') {
      throw new Error('Vehicle plate is required');
    }

    if (!transportCompanyId || transportCompanyId.trim() === '') {
      throw new Error('Transport company ID is required');
    }

    const url = `${API_BASE_URL}/api/vehicles/${encodeURIComponent(vehiclePlate)}/drivers?transportCompanyId=${transportCompanyId}`;
    
    console.log('👥 Fetching drivers for vehicle:', vehiclePlate);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('✅ Drivers for vehicle fetched successfully:', result);
    
    return {
      success: true,
      count: result.count || 0,
      data: result.data || []
    };
  } catch (error) {
    console.error('❌ Error fetching drivers for vehicle:', error);
    return {
      success: false,
      count: 0,
      data: []
    };
  }
}
