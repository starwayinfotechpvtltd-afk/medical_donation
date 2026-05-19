/**
 * API Client
 * Centralized HTTP client matching backend response contract:
 *   Success: { success: true,  message, data?, meta? }
 *   Error:   { success: false, message, code?, errors? }
 */

import { getToken, removeToken, isTokenExpired } from './token';
import { AuthRole, getDefaultLoginPath } from './auth-routes';
import { useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiException extends Error {
  status: number;
  code?: string;
  errors?: Array<{ field: string; message: string }>;

  constructor(status: number, message: string, code?: string, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

// ── Config ─────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Core Fetch ─────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  // Auto-redirect on expired token (except auth endpoints)
  if (token && isTokenExpired() && !endpoint.startsWith('/auth')) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = getDefaultLoginPath(window.location.pathname);
    }
    throw new ApiException(401, 'Token expired. Please log in again.', 'TOKEN_EXPIRED');
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Handle non-JSON responses (e.g., file downloads)
    const contentType = res.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      if (!res.ok) {
        throw new ApiException(res.status, `Request failed with status ${res.status}`);
      }
      // Return raw response for file downloads
      return { success: true, message: 'OK', data: res as unknown as T };
    }

    const body: ApiResponse<T> | ApiError = await res.json();

    if (!res.ok || !body.success) {
      const errorBody = body as ApiError;

      // Handle auth failures globally
      if (res.status === 401) {
        removeToken();
        if (typeof window !== 'undefined' && !endpoint.startsWith('/auth')) {
          window.location.href = getDefaultLoginPath(window.location.pathname);
        }
      }

      throw new ApiException(
        res.status,
        errorBody.message || 'Something went wrong',
        errorBody.code,
        errorBody.errors
      );
    }

    return body as ApiResponse<T>;
  } catch (err) {
    if (err instanceof ApiException) throw err;

    // Network errors
    throw new ApiException(
      0,
      err instanceof Error ? err.message : 'Network error. Please check your connection.',
      'NETWORK_ERROR'
    );
  }
}

// ── HTTP Methods ───────────────────────────────────────────────────

export const api = {
  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return request<T>(url);
  },

  post<T>(endpoint: string, data?: unknown) {
    return request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data?: unknown) {
    return request<T>(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, {
      method: 'DELETE',
    });
  },

  /**
   * For file downloads — returns raw Response object
   */
  download(endpoint: string) {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    return fetch(`${BASE_URL}${endpoint}`, { headers });
  },
};

