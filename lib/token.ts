const TOKEN_KEY = 'auth_token';

// ── Storage ────────────────────────────────────────────────────────

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// ── Decode (client-side only, no verification) ─────────────────────

interface TokenPayload {
  sub: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'patient' | 'lab_technician';
  status: string;
  iat: number;
  exp: number;
  iss: string;
}

export const getTokenPayload = (): TokenPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const payload = getTokenPayload();
  if (!payload?.exp) return true;
  // 30-second buffer to avoid edge cases
  return Date.now() >= (payload.exp * 1000) - 30_000;
};