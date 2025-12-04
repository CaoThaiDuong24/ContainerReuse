import { Request, Response } from 'express';
import driverApiService from '../services/driverApiService';

/**
 * GET /api/vehicles/company/:transportCompanyId
 * Get all vehicles for a specific transport company
 */
export const getVehiclesByCompany = async (req: Request, res: Response) => {
  try {
    const { transportCompanyId } = req.params;

    if (!transportCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Transport company ID is required'
      });
    }

    // Get all drivers for the company
    const drivers = await driverApiService.fetchDriversByCompany(transportCompanyId);
    
    if (!drivers) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch driver data from external API',
        count: 0,
        data: []
      });
    }

    // Extract unique vehicles with their drivers
    const vehicleMap = new Map<string, any>();
    
    drivers.forEach(driver => {
      if (driver.vehiclePlate && driver.vehiclePlate.trim() !== '') {
        const plate = driver.vehiclePlate;
        
        if (!vehicleMap.has(plate)) {
          vehicleMap.set(plate, {
            id: driver.vehicleId || plate,
            vehiclePlate: plate,
            transportCompanyId: driver.transportCompanyId,
            drivers: []
          });
        }
        
        // Add driver info to vehicle
        vehicleMap.get(plate)!.drivers.push({
          id: driver.id,
          driverCode: driver.driverCode,
          driverName: driver.driverName,
          fullName: driver.fullName,
          phoneNumber: driver.phoneNumber,
          idCard: driver.idCard
        });
      }
    });

    // Convert map to array and sort by plate number
    const vehicles = Array.from(vehicleMap.values()).sort((a, b) => 
      a.vehiclePlate.localeCompare(b.vehiclePlate)
    );
    
    return res.json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('❌ Error in getVehiclesByCompany:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting vehicles',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * GET /api/vehicles/:vehiclePlate/drivers
 * Get all drivers for a specific vehicle plate
 */
export const getDriversByVehicle = async (req: Request, res: Response) => {
  try {
    const { vehiclePlate } = req.params;
    const { transportCompanyId } = req.query;

    if (!vehiclePlate) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle plate is required'
      });
    }

    if (!transportCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Transport company ID is required'
      });
    }

    // Get all drivers for the company
    const drivers = await driverApiService.fetchDriversByCompany(transportCompanyId as string);
    
    if (!drivers) {
      return res.status(503).json({
        success: false,
        message: 'Unable to fetch driver data from external API',
        data: []
      });
    }

    // Filter drivers by vehicle plate
    const vehicleDrivers = drivers
      .filter(driver => driver.vehiclePlate === vehiclePlate)
      .map(driver => ({
        id: driver.id,
        driverCode: driver.driverCode,
        driverName: driver.driverName,
        fullName: driver.fullName,
        phoneNumber: driver.phoneNumber,
        idCard: driver.idCard,
        vehiclePlate: driver.vehiclePlate
      }));
    
    return res.json({
      success: true,
      count: vehicleDrivers.length,
      data: vehicleDrivers
    });
  } catch (error) {
    console.error('❌ Error in getDriversByVehicle:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting drivers for vehicle',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
