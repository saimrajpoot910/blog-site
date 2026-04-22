import { adminGet } from '../http';

export function listPermissionIds(): Promise<string[]> {
  return adminGet<string[]>('/permissions');
}
