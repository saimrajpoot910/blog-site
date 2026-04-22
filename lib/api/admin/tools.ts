import { getAdminApiRoot, isApiConfigured } from '../config';
import { ApiError } from '../error';

/** Backend returns raw JPEG bytes (not JSON). */
export async function compressImage(file: File, quality: 50 | 60 | 70 | 80 | 90): Promise<Blob> {
  if (!isApiConfigured()) {
    throw new ApiError(0, 'Set NEXT_PUBLIC_API_BASE_URL in .env.local', 'CONFIG');
  }
  const root = getAdminApiRoot();
  const form = new FormData();
  form.append('file', file);
  form.append('quality', String(quality));
  const headers = new Headers();
  const key = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
  if (key) headers.set('x-admin-api-key', key);

  const res = await fetch(`${root}/tools/compress-image`, { method: 'POST', body: form, headers });
  if (!res.ok) {
    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }
    throw ApiError.fromResponse(res.status, json ?? { error: { message: text || res.statusText } });
  }
  return res.blob();
}
