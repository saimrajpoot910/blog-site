import { adminPostForm } from '../http';

export interface MediaUploadResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  entityType: string;
  entityId: string | null;
}

export function uploadMedia(
  file: File,
  meta: { entityType: 'store' | 'category' | 'deal' | 'coupon'; entityId?: string },
): Promise<MediaUploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('entityType', meta.entityType);
  if (meta.entityId) form.append('entityId', meta.entityId);
  return adminPostForm<MediaUploadResult>('/media', form);
}
