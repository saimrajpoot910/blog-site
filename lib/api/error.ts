export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromResponse(status: number, body: unknown): ApiError {
    if (body && typeof body === 'object' && 'error' in body) {
      const err = (body as { error?: { message?: string; code?: string; details?: unknown } }).error;
      return new ApiError(status, err?.message ?? `Request failed (${status})`, err?.code ?? 'HTTP', err?.details);
    }
    return new ApiError(status, `Request failed (${status})`, 'HTTP', body);
  }
}
