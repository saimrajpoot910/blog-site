import { getAdminApiRoot, isApiConfigured } from './config';
import { ApiError } from './error';

function buildUrl(path: string): string {
  const root = getAdminApiRoot();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p}`;
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(res.status, 'Invalid JSON response', 'PARSE', text.slice(0, 200));
  }
}

/** Low-level fetch with admin headers. Throws ApiError on non-OK. */
export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!isApiConfigured()) {
    throw new ApiError(0, 'Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. http://localhost:5000)', 'CONFIG');
  }
  const url = buildUrl(path);
  const headers = new Headers(init.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  const body = init.body;
  if (body && typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const key = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
  if (key) headers.set('x-admin-api-key', key);

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const parsed = await parseJson(res);
    throw ApiError.fromResponse(res.status, parsed);
  }
  return res;
}

/** JSON body with `{ data: T }` envelope (typical admin success). */
export async function adminGet<T>(path: string): Promise<T> {
  const res = await adminFetch(path, { method: 'GET' });
  const json = (await parseJson(res)) as { data: T };
  return json.data;
}

export async function adminPost<T>(path: string, jsonBody: unknown): Promise<T> {
  const res = await adminFetch(path, { method: 'POST', body: JSON.stringify(jsonBody) });
  const json = (await parseJson(res)) as { data: T };
  return json.data;
}

export async function adminPatch<T>(path: string, jsonBody: unknown): Promise<T> {
  const res = await adminFetch(path, { method: 'PATCH', body: JSON.stringify(jsonBody) });
  const json = (await parseJson(res)) as { data: T };
  return json.data;
}

export async function adminPut<T>(path: string, jsonBody: unknown): Promise<T> {
  const res = await adminFetch(path, { method: 'PUT', body: JSON.stringify(jsonBody) });
  const json = (await parseJson(res)) as { data: T };
  return json.data;
}

export async function adminDelete(path: string): Promise<void> {
  const res = await adminFetch(path, { method: 'DELETE' });
  if (res.status !== 204 && res.status !== 200) {
    /* some stacks return 200 with body; we already OK */
  }
}

/** multipart: append meta as JSON fields expected by validateBody after multer */
export async function adminPostForm<T>(path: string, form: FormData): Promise<T> {
  if (!isApiConfigured()) {
    throw new ApiError(0, 'Set NEXT_PUBLIC_API_BASE_URL in .env.local', 'CONFIG');
  }
  const url = buildUrl(path);
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  const key = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
  if (key) headers.set('x-admin-api-key', key);

  const res = await fetch(url, { method: 'POST', body: form, headers });
  if (!res.ok) {
    const parsed = await parseJson(res);
    throw ApiError.fromResponse(res.status, parsed);
  }
  const json = (await parseJson(res)) as { data: T };
  return json.data;
}
