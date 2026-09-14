export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const baseUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: options.signal ?? AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError('Unable to reach CoreConnect. Please try again.', 0);
  }
  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('The server returned an unexpected response. Please try again.', response.status);
  }
  if (!response.ok) {
    throw new ApiError(body.error?.message || body.message || 'The request failed.', response.status);
  }
  return body as T;
}
