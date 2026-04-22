import { adminDelete, adminGet, adminPatch, adminPost } from '../http';

export interface NetworkListItem {
  id: string;
  name: string;
  trackingUrl: string | null;
  status: string;
  assignedUsers: number;
  createdAt: string;
  updatedAt: string;
}

export function listNetworks(): Promise<NetworkListItem[]> {
  return adminGet<NetworkListItem[]>('/networks');
}

export function getNetwork(id: string): Promise<NetworkListItem> {
  return adminGet<NetworkListItem>(`/networks/${encodeURIComponent(id)}`);
}

export function createNetwork(body: { name: string; trackingUrl?: string | null }): Promise<NetworkListItem> {
  return adminPost<NetworkListItem>('/networks', body);
}

export function updateNetwork(
  id: string,
  body: { name?: string; trackingUrl?: string | null; status?: 'ACTIVE' | 'INACTIVE' },
): Promise<NetworkListItem> {
  return adminPatch<NetworkListItem>(`/networks/${encodeURIComponent(id)}`, body);
}

export function setNetworkStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<NetworkListItem> {
  return adminPatch<NetworkListItem>(`/networks/${encodeURIComponent(id)}/status`, { status });
}

export function deleteNetwork(id: string): Promise<void> {
  return adminDelete(`/networks/${encodeURIComponent(id)}`);
}
