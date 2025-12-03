/**
 * Container Type Labels - Vietnamese labels for container type codes
 * This mapping is based on standard container type codes
 */

export const CONTAINER_TYPE_LABELS: Record<string, string> = {
  'GP': 'Khô (GP)',
  'HC': 'Cao (HC)', 
  'RF': 'Lạnh (RF)',
  'UT': 'Nóc mở (UT)',
  'OT': 'Nóc mở (OT)',
  'PC': 'Phẳng (PC)',
  'PF': 'Phẳng cố định (PF)',
  'FR': 'Phẳng (FR)',
  'TN': 'Bồn (TN)',
  'TK': 'Bồn (TK)'
}

/**
 * Get Vietnamese label for container type code
 * @param typeCode - Container type code (GP, HC, RF, etc.)
 * @returns Vietnamese label or the original code if not found
 */
export function getContainerTypeLabel(typeCode: string): string {
  return CONTAINER_TYPE_LABELS[typeCode] || typeCode
}
