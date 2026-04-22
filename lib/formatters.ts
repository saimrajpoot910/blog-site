/** Backend enums → human labels used in existing UI classes */

export function formatUserStatus(status: string): 'Active' | 'Disabled' {
  return status === 'ACTIVE' ? 'Active' : 'Disabled';
}

export function userStatusToApi(label: 'Active' | 'Disabled'): 'ACTIVE' | 'DISABLED' {
  return label === 'Active' ? 'ACTIVE' : 'DISABLED';
}

export function formatNetworkStatus(status: string): 'Active' | 'Inactive' {
  return status === 'ACTIVE' ? 'Active' : 'Inactive';
}

export function networkStatusToApi(label: 'Active' | 'Inactive'): 'ACTIVE' | 'INACTIVE' {
  return label === 'Active' ? 'ACTIVE' : 'INACTIVE';
}

export function formatStoreStatus(status: string): 'Active' | 'Draft' | 'Disabled' {
  if (status === 'ACTIVE') return 'Active';
  if (status === 'DRAFT') return 'Draft';
  return 'Disabled';
}

export function storeStatusToApi(label: 'Active' | 'Draft' | 'Disabled'): 'ACTIVE' | 'DRAFT' | 'DISABLED' {
  if (label === 'Active') return 'ACTIVE';
  if (label === 'Draft') return 'DRAFT';
  return 'DISABLED';
}

export function formatCategoryFeature(enabled: boolean): 'Enabled' | 'Disabled' {
  return enabled ? 'Enabled' : 'Disabled';
}
