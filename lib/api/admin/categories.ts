import { adminDelete, adminGet, adminPatch, adminPost } from '../http';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featureEnabled: boolean;
  slider: boolean;
  createdAt: string;
  updatedAt: string;
}

export function listCategories(): Promise<Category[]> {
  return adminGet<Category[]>('/categories');
}

export function getCategory(id: string): Promise<Category> {
  return adminGet<Category>(`/categories/${encodeURIComponent(id)}`);
}

export function createCategory(body: {
  name: string;
  slug?: string | null;
  description?: string | null;
  featureEnabled?: boolean;
  slider?: boolean;
}): Promise<Category> {
  return adminPost<Category>('/categories', body);
}

export function updateCategory(
  id: string,
  body: {
    name?: string;
    slug?: string;
    description?: string | null;
    featureEnabled?: boolean;
    slider?: boolean;
  },
): Promise<Category> {
  return adminPatch<Category>(`/categories/${encodeURIComponent(id)}`, body);
}

export function setCategoryFeature(id: string, featureEnabled: boolean): Promise<Category> {
  return adminPatch<Category>(`/categories/${encodeURIComponent(id)}/feature`, { featureEnabled });
}

export function setCategorySlider(id: string, slider: boolean): Promise<Category> {
  return adminPatch<Category>(`/categories/${encodeURIComponent(id)}/slider`, { slider });
}

export function deleteCategory(id: string): Promise<void> {
  return adminDelete(`/categories/${encodeURIComponent(id)}`);
}
