import { adminDelete, adminGet, adminPatch, adminPost, adminPut } from '../http';

export interface CouponListItem {
  id: string;
  storeId: string;
  storeName: string;
  title: string;
  offerDetails: string;
  couponCode: string | null;
  destinationUrl: string | null;
  descriptionHtml: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function listCoupons(params?: { storeId?: string }): Promise<CouponListItem[]> {
  const q = params?.storeId ? `?storeId=${encodeURIComponent(params.storeId)}` : '';
  return adminGet<CouponListItem[]>(`/coupons${q}`);
}

export function getCoupon(id: string): Promise<CouponListItem> {
  return adminGet<CouponListItem>(`/coupons/${encodeURIComponent(id)}`);
}

export function createCoupon(body: {
  storeId: string;
  title: string;
  offerDetails: string;
  couponCode?: string | null;
  destinationUrl?: string | null;
  descriptionHtml?: string | null;
  active?: boolean;
  featured?: boolean;
}): Promise<CouponListItem> {
  return adminPost<CouponListItem>('/coupons', body);
}

export function updateCoupon(
  id: string,
  body: {
    storeId?: string;
    title?: string;
    offerDetails?: string;
    couponCode?: string | null;
    destinationUrl?: string | null;
    descriptionHtml?: string | null;
    active?: boolean;
    featured?: boolean;
  },
): Promise<CouponListItem> {
  return adminPatch<CouponListItem>(`/coupons/${encodeURIComponent(id)}`, body);
}

export function deleteCoupon(id: string): Promise<void> {
  return adminDelete(`/coupons/${encodeURIComponent(id)}`);
}

export interface CouponOrderRow {
  id: string;
  title: string;
  offerDetails: string;
  sortOrder: number;
}

export function listCouponsOrderedForStore(storeId: string): Promise<CouponOrderRow[]> {
  return adminGet<CouponOrderRow[]>(`/coupons/stores/${encodeURIComponent(storeId)}/order`);
}

export function reorderCouponsForStore(storeId: string, orderedIds: string[]): Promise<CouponOrderRow[]> {
  return adminPut<CouponOrderRow[]>(`/coupons/stores/${encodeURIComponent(storeId)}/order`, { orderedIds });
}
