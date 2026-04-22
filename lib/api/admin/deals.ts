import { adminDelete, adminGet, adminPatch, adminPost } from '../http';

export interface Deal {
  id: string;
  title: string;
  shortDescriptionHtml: string;
  longDescriptionHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export function listDeals(): Promise<Deal[]> {
  return adminGet<Deal[]>('/deals');
}

export function getDeal(id: string): Promise<Deal> {
  return adminGet<Deal>(`/deals/${encodeURIComponent(id)}`);
}

export function createDeal(body: {
  title: string;
  shortDescriptionHtml?: string;
  longDescriptionHtml?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}): Promise<Deal> {
  return adminPost<Deal>('/deals', body);
}

export function updateDeal(
  id: string,
  body: {
    title?: string;
    shortDescriptionHtml?: string;
    longDescriptionHtml?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
  },
): Promise<Deal> {
  return adminPatch<Deal>(`/deals/${encodeURIComponent(id)}`, body);
}

export function deleteDeal(id: string): Promise<void> {
  return adminDelete(`/deals/${encodeURIComponent(id)}`);
}
