import { getApiV1Root } from './config';
import { ApiError } from './error';

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(res.status, 'Invalid JSON response', 'PARSE');
  }
}

export interface AuthLoginResult {
  token: string;
  user: { id: string; username: string; role: string; status: string };
}

export async function authLogin(username: string, password: string): Promise<AuthLoginResult> {
  const root = getApiV1Root();
  if (!root) throw new ApiError(0, 'Set NEXT_PUBLIC_API_BASE_URL in .env.local', 'CONFIG');
  const res = await fetch(`${root}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await parseJson(res);
  if (!res.ok) throw ApiError.fromResponse(res.status, body);
  return (body as { data: AuthLoginResult }).data;
}

export async function authRegister(username: string, password: string): Promise<AuthLoginResult> {
  const root = getApiV1Root();
  if (!root) throw new ApiError(0, 'Set NEXT_PUBLIC_API_BASE_URL in .env.local', 'CONFIG');
  const res = await fetch(`${root}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const body = await parseJson(res);
  if (!res.ok) throw ApiError.fromResponse(res.status, body);
  return (body as { data: AuthLoginResult }).data;
}

export async function authMe(token: string): Promise<AuthLoginResult['user'] & { createdAt: string | null; updatedAt: string | null }> {
  const root = getApiV1Root();
  if (!root) throw new ApiError(0, 'Set NEXT_PUBLIC_API_BASE_URL in .env.local', 'CONFIG');
  const res = await fetch(`${root}/auth/me`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
  const body = await parseJson(res);
  if (!res.ok) throw ApiError.fromResponse(res.status, body);
  return (body as { data: AuthLoginResult['user'] & { createdAt: string | null; updatedAt: string | null } }).data;
}
