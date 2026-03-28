/**
 * authService.ts — Frontend Authentication Service
 * Lectures 41-44: JWT token management, login/register
 * 
 * This module manages authentication state on the React frontend.
 * 
 * Security: JWT tokens are stored in a module-level variable (memory),
 * NOT in localStorage or sessionStorage. This prevents XSS attacks from
 * stealing the token. The trade-off is that tokens are lost on page refresh
 * (user must re-login), which is acceptable for this demo.
 * 
 * Usage:
 *   import { authService } from './authService';
 *   const { token, user } = await authService.login(email, password);
 *   const token = authService.getToken(); // for Authorization header
 */

// ── In-memory token storage ─────────────────────────────────────────────────
// NEVER stored in localStorage (XSS vulnerable) or cookies (CSRF vulnerable)
let _token: string | null = null;
let _user: AuthUser | null = null;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'holder' | 'issuer' | 'verifier';
  did?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  message?: string;
  error?: string;
}

const BASE = '/api/auth';

// ── API Helper ──────────────────────────────────────────────────────────────
async function authFetch(path: string, options?: RequestInit): Promise<AuthResponse> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || `HTTP ${res.status}`);
  }

  return json as AuthResponse;
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH SERVICE
// ═════════════════════════════════════════════════════════════════════════════
export const authService = {
  /**
   * Register a new user account
   * @returns JWT token and user profile
   */
  register: async (email: string, password: string, name: string, role?: string) => {
    const data = await authFetch('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role: role || 'holder' }),
    });

    _token = data.token;
    _user = data.user;

    return { token: data.token, user: data.user };
  },

  /**
   * Login with email + password
   * @returns JWT token and user profile
   */
  login: async (email: string, password: string) => {
    const data = await authFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    _token = data.token;
    _user = data.user;

    return { token: data.token, user: data.user };
  },

  /**
   * Verify current token and fetch user profile
   * @returns user profile if token is valid, null otherwise
   */
  me: async (): Promise<AuthUser | null> => {
    if (!_token) return null;

    try {
      const res = await fetch(`${BASE}/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_token}`,
        },
      });

      if (!res.ok) {
        // Token expired or invalid — clear state
        _token = null;
        _user = null;
        return null;
      }

      const json = await res.json();
      _user = json.user;
      return json.user;
    } catch {
      return null;
    }
  },

  /**
   * Clear token and user state (logout)
   */
  logout: () => {
    _token = null;
    _user = null;
  },

  /**
   * Get the current JWT token (for Authorization header)
   * Returns null if not authenticated
   */
  getToken: (): string | null => _token,

  /**
   * Get the current user profile (from memory)
   * Returns null if not authenticated
   */
  getUser: (): AuthUser | null => _user,

  /**
   * Check if the user is currently authenticated
   */
  isAuthenticated: (): boolean => _token !== null,
};
