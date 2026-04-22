import { adminDelete, adminGet, adminPatch, adminPost, adminPostForm } from '../http';

export interface StoreListItem {
  id: string;
  name: string;
  heading: string;
  status: string;
  featured: boolean;
  categories: string[];
}

export interface StoreCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface StoreDetail {
  id: string;
  name: string;
  heading: string;
  status: string;
  featured: boolean;
  affiliateUrl: string | null;
  descriptionShortHtml: string;
  descriptionLongHtml: string;
  logoUrl: string | null;
  categoryIds: string[];
  categories: StoreCategoryRef[];
  createdAt: string;
  updatedAt: string;
}

export function listStores(): Promise<StoreListItem[]> {
  return adminGet<StoreListItem[]>('/stores');
}

export function getStore(id: string): Promise<StoreDetail> {
  return adminGet<StoreDetail>(`/stores/${encodeURIComponent(id)}`);
}

export function createStore(body: {
  name: string;
  heading: string;
  status?: string;
  featured?: boolean;
  affiliateUrl?: string | null;
  descriptionShortHtml?: string;
  descriptionLongHtml?: string;
  categoryIds?: string[];
}): Promise<StoreDetail> {
  return adminPost<StoreDetail>('/stores', body);
}

export function updateStore(
  id: string,
  body: {
    name?: string;
    heading?: string;
    status?: string;
    featured?: boolean;
    affiliateUrl?: string | null;
    descriptionShortHtml?: string;
    descriptionLongHtml?: string;
    logoUrl?: string | null;
    categoryIds?: string[];
  },
): Promise<StoreDetail> {
  return adminPatch<StoreDetail>(`/stores/${encodeURIComponent(id)}`, body);
}

export function setStoreFeatured(id: string, featured: boolean): Promise<StoreDetail> {
  return adminPatch<StoreDetail>(`/stores/${encodeURIComponent(id)}/featured`, { featured });
}

export function uploadStoreLogo(id: string, file: File): Promise<StoreDetail> {
  const form = new FormData();
  form.append('file', file);
  return adminPostForm<StoreDetail>(`/stores/${encodeURIComponent(id)}/logo`, form);
}

export function deleteStore(id: string): Promise<void> {
  return adminDelete(`/stores/${encodeURIComponent(id)}`);
}
