import { adminGet } from '../http';

export interface DashboardStats {
  totalCoupons: number;
  blogPosts: number;
  stores: number;
  users: number;
}

export function getDashboardStats(): Promise<DashboardStats> {
  return adminGet<DashboardStats>('/dashboard/stats');
}
