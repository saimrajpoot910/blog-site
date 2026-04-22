/**
 * Base origin of the Express app (no trailing slash), e.g. http://localhost:5000
 * Admin routes are mounted at /api/v1/admin (override with NEXT_PUBLIC_ADMIN_API_PREFIX).
 */
export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
}

export function getAdminApiPrefix(): string {
  const p = process.env.NEXT_PUBLIC_ADMIN_API_PREFIX ?? '/api/v1/admin';
  return p.startsWith('/') ? p : `/${p}`;
}

export function getAdminApiRoot(): string {
  const base = getApiBaseUrl();
  const prefix = getAdminApiPrefix();
  if (!base) return '';
  return `${base}${prefix}`;
}

export function isApiConfigured(): boolean {
  return getApiBaseUrl().length > 0;
}

/** Versioned public API (auth, etc.) — `http://host:port/api/v1` */
export function getApiV1Root(): string {
  const base = getApiBaseUrl();
  if (!base) return '';
  return `${base}/api/v1`;
}
