import { adminDelete, adminGet, adminPatch, adminPost, adminPut } from '../http';

export interface UserListItem {
  id: string;
  username: string;
  role: string;
  status: string;
  network: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends UserListItem {
  networkId: string | null;
  enabledPermissionIds: string[];
}

export function listUsers(): Promise<UserListItem[]> {
  return adminGet<UserListItem[]>('/users');
}

export function getUser(id: string): Promise<UserDetail> {
  return adminGet<UserDetail>(`/users/${encodeURIComponent(id)}`);
}

export function createUser(body: {
  username: string;
  password: string;
  role: string;
  networkId?: string | null;
}): Promise<UserListItem> {
  return adminPost<UserListItem>('/users', body);
}

export function updateUser(
  id: string,
  body: { username?: string; password?: string; role?: string; networkId?: string | null },
): Promise<UserListItem> {
  return adminPatch<UserListItem>(`/users/${encodeURIComponent(id)}`, body);
}

export function setUserStatus(id: string, status: 'ACTIVE' | 'DISABLED'): Promise<UserListItem> {
  return adminPatch<UserListItem>(`/users/${encodeURIComponent(id)}/status`, { status });
}

export function deleteUser(id: string): Promise<void> {
  return adminDelete(`/users/${encodeURIComponent(id)}`);
}

export function getUserPermissions(id: string): Promise<{ userId: string; permissions: { id: string; enabled: boolean }[] }> {
  return adminGet(`/users/${encodeURIComponent(id)}/permissions`);
}

export function replaceUserPermissions(id: string, enabledPermissionIds: string[]): Promise<{ userId: string; permissions: { id: string; enabled: boolean }[] }> {
  return adminPut(`/users/${encodeURIComponent(id)}/permissions`, { enabledPermissionIds });
}
