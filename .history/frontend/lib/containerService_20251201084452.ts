// Container Service - API calls for container management

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface Container {
  id: string
  containerId: string
  size: '20ft' | '40ft' | '45ft'
  type: 'dry' | 'reefer' | 'opentop' | 'flatrack' | 'tank'
  status: 'available' | 'in-use' | 'maintenance' | 'reserved'
  depotId: string
  depotName: string
  owner: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  lastInspection: string
  inDate: string
  estimatedOutDate?: string
  currentLocation?: string
}

export interface ContainerApiResponse {
  success: boolean
  message: string
  data: any
}

/**
 * Fetch list of reuse containers from API
 */
export const fetchReuseContainers = async (): Promise<ContainerApiResponse> => {
  try {
    console.log('Fetching reuse containers from:', `${API_BASE_URL}/api/containers/reuse-now`)
    
    const response = await fetch(`${API_BASE_URL}/api/containers/reuse-now`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'no-store' // Disable caching for real-time data
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('Container data received:', result)
    
    return {
      success: result.success || false,
      message: result.message || 'Success',
      data: result.data || []
    }
  } catch (error) {
    console.error('Error fetching reuse containers:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }
  }
}

/**
 * Transform API data to Container format
 * Modify this function based on actual API response structure
 */
export const transformApiDataToContainers = (apiData: any[]): Container[] => {
  if (!Array.isArray(apiData)) {
    console.warn('API data is not an array:', apiData)
    return []
  }

  return apiData.map((item: any, index: number) => ({
    id: item.id || `CNT${index + 1}`,
    containerId: item.containerId || item.containerNo || item.container_id || 'N/A',
    size: item.size || item.containerSize || '40ft',
    type: item.type || item.containerType || 'dry',
    status: item.status || 'available',
    depotId: item.depotId || item.depot_id || 'UNKNOWN',
    depotName: item.depotName || item.depot_name || 'Unknown Depot',
    owner: item.owner || item.ownerName || 'N/A',
    condition: item.condition || 'good',
    lastInspection: item.lastInspection || item.last_inspection || new Date().toISOString().split('T')[0],
    inDate: item.inDate || item.in_date || new Date().toISOString().split('T')[0],
    estimatedOutDate: item.estimatedOutDate || item.estimated_out_date,
    currentLocation: item.currentLocation || item.current_location || item.location
  }))
}

export default {
  fetchReuseContainers,
  transformApiDataToContainers
}
