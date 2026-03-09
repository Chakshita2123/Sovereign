/**
 * api.ts — Sovereign Frontend API Service
 * ════════════════════════════════════════
 * This module connects the React frontend to the Express backend.
 * All data fetches go through these functions instead of using
 * hardcoded mockData directly.
 *
 * The Vite dev server proxies /api/* → http://localhost:3001/api/*
 * (configured in vite.config.ts)
 */

import type {
  Credential,
  Activity,
  ProofRequest,
} from '../data/mockData';

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
const BASE = '/api';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data as T;
}

// ═════════════════════════════════════════════════════════════════════════════
// CREDENTIALS
// ═════════════════════════════════════════════════════════════════════════════
export const credentialsApi = {
  /** Fetch all credentials */
  getAll: () => apiFetch<Credential[]>('/credentials'),

  /** Fetch a single credential by ID */
  getById: (id: string) => apiFetch<Credential>(`/credentials/${id}`),

  /** Create a new credential */
  create: (data: Partial<Credential>) =>
    apiFetch<Credential>('/credentials', { method: 'POST', body: JSON.stringify(data) }),

  /** Share a credential — generates ZKP proof */
  share: (id: string, fields: string[]) =>
    apiFetch<{ proof: string; verificationUrl: string }>(
      `/credentials/${id}/share`,
      { method: 'POST', body: JSON.stringify({ fields }) }
    ),

  /** Generate ZKP proof for selective disclosure */
  zkp: (id: string, predicates: Record<string, string>) =>
    apiFetch<{ zkpProof: string; disclosedFields: string[] }>(
      `/credentials/${id}/zkp`,
      { method: 'POST', body: JSON.stringify({ predicates }) }
    ),

  /** Delete a credential */
  delete: (id: string) =>
    apiFetch<{ deleted: boolean }>(`/credentials/${id}`, { method: 'DELETE' }),
};

// ═════════════════════════════════════════════════════════════════════════════
// IDENTITY  (DIDs)
// ═════════════════════════════════════════════════════════════════════════════
export const identityApi = {
  /** Fetch all DIDs */
  getAll: () => apiFetch<unknown[]>('/identity'),

  /** Resolve a specific DID */
  resolve: (did: string) => apiFetch<unknown>(`/identity/${encodeURIComponent(did)}`),

  /** Create a new DID */
  create: (method?: string) =>
    apiFetch<unknown>('/identity', { method: 'POST', body: JSON.stringify({ method: method || 'did:indy' }) }),

  /** Rotate keys for a DID */
  rotate: (did: string) =>
    apiFetch<unknown>(`/identity/${encodeURIComponent(did)}/rotate`, { method: 'POST' }),

  /** Get identity score */
  score: (did: string) =>
    apiFetch<{ score: number; breakdown: Record<string, number> }>(
      `/identity/${encodeURIComponent(did)}/score`
    ),
};

// ═════════════════════════════════════════════════════════════════════════════
// ISSUERS
// ═════════════════════════════════════════════════════════════════════════════
export const issuersApi = {
  /** Fetch all issuers */
  getAll: () => apiFetch<unknown[]>('/issuers'),

  /** Fetch a specific issuer */
  getById: (id: string) => apiFetch<unknown>(`/issuers/${id}`),

  /** Get stats for an issuer */
  stats: (id: string) => apiFetch<unknown>(`/issuers/${id}/stats`),

  /** Issue a credential from an issuer */
  issue: (issuerId: string, payload: unknown) =>
    apiFetch<unknown>(`/issuers/${issuerId}/issue`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Bulk issue credentials (CSV upload as JSON) */
  bulk: (issuerId: string, records: unknown[]) =>
    apiFetch<unknown>(`/issuers/${issuerId}/bulk`, {
      method: 'POST',
      body: JSON.stringify({ records }),
    }),

  /** Download export file */
  exportUrl: (issuerId: string) => `${BASE}/issuers/${issuerId}/export`,
};

// ═════════════════════════════════════════════════════════════════════════════
// ACTIVITY FEED
// ═════════════════════════════════════════════════════════════════════════════
export const activityApi = {
  /** Fetch activity feed, optional limit and type filter */
  getAll: (params?: { limit?: number; type?: string }) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.type)  qs.set('type', params.type);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<Activity[]>(`/activity${query}`);
  },

  /** Fetch all pending proof requests */
  getProofRequests: () => apiFetch<ProofRequest[]>('/activity/proof-requests'),

  /** Approve a proof request (sends ZKP) */
  approveProofRequest: (id: string) =>
    apiFetch<unknown>(`/activity/proof-requests/${id}/approve`, { method: 'POST' }),

  /** Deny a proof request */
  denyProofRequest: (id: string) =>
    apiFetch<unknown>(`/activity/proof-requests/${id}/deny`, { method: 'POST' }),
};

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD  (aggregated overview data)
// ═════════════════════════════════════════════════════════════════════════════
export interface DashboardData {
  kpi: {
    totalCredentials: number;
    totalCredentialsTrend: number;
    activeVerifications: number;
    activeVerificationsTrend: number;
    credentialsExpiring: number;
    credentialsExpiringTrend: number;
    securityScore: number;
  };
  issuerStats: {
    totalIssued: number;
    revokedToday: number;
    pendingDelivery: number;
    activeTemplates: number;
    credentialHealth: number;
  };
  recentActivities: Activity[];
  pendingProofRequests: ProofRequest[];
}

export const dashboardApi = {
  /** Full dashboard data in one call */
  get: () => apiFetch<DashboardData>('/dashboard'),

  /** Just KPI numbers */
  kpi: () => apiFetch<DashboardData['kpi']>('/dashboard/kpi'),
};

// ═════════════════════════════════════════════════════════════════════════════
// SERVER HEALTH CHECK
// ═════════════════════════════════════════════════════════════════════════════
export const healthApi = {
  check: () =>
    fetch('/api/health')
      .then(r => r.ok)
      .catch(() => false),
};
