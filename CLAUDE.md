# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sovereign is a Self-Sovereign Identity (SSI) platform — a full-stack personal data wallet for managing Decentralized Identifiers (DIDs), Verifiable Credentials (W3C VC), and Zero-Knowledge Proofs. It follows a Node.js lecture syllabus (Lectures 1-48) so file structure and middleware ordering are intentional and curriculum-mapped — do not reorganize.

## Commands

```bash
# Install all dependencies (root + client + server)
npm run install:all

# Run both frontend and backend concurrently
npm run dev

# Run individually
npm run dev:client    # Vite on :5173
npm run dev:server    # Express+nodemon on :3001

# Seed MongoDB with mock data (Indian gov issuers: UIDAI, IIT Delhi, etc.)
npm run seed

# Migrate legacy JSON files to MongoDB
npm run migrate

# Production start (seeds + starts server)
npm start
```

No test framework is configured. No linter is configured.

## Architecture

**Monorepo with two workspaces:**
- `client/` — React 18 + Vite + TypeScript SPA (Radix UI / shadcn components, Tailwind v4)
- `server/` — Express 4 + Mongoose (CommonJS, no TypeScript)

Root `package.json` uses `concurrently` to run both. Vite proxies `/api/*` to `:3001`.

### Dual Auth System

1. **JWT (stateless)** — for all `/api/*` routes. Passport.js JWT strategy. Token stored in-memory on the client (not localStorage). Lost on refresh (intentional for this demo).
2. **Sessions** — for `/portal/*` SSR routes only. `express-session` + MongoStore. Portal uses hardcoded admin from `ADMIN_EMAIL`/`ADMIN_PASS_HASH` env vars.

### Middleware Chain (order matters — do not reorder)

Helmet → requestId → CORS → body parsers → method-override → compression → session → flash → passport → rate limiter → morgan → custom logger → static files → routes

### Route Mounting

- `/api/auth` — public, stricter rate limit (10/15min)
- `/api/credentials`, `/api/identity`, `/api/issuers`, `/api/activity`, `/api/dashboard` — JWT-protected
- `/portal` — auth-portal routes mounted first (login/logout), then session-guarded portal routes
- `/api-docs` — rewrites to portal `/docs` handler

### Real-Time (Socket.io)

Room-based: `wallet:{did}` for targeted holder events, `dashboard` for broadcasts. Access io via `req.app.get('io')`.

### Data Models (Mongoose)

- **User** — bcrypt (cost 12), virtual password field triggers pre-save hook, `passwordHash` excluded from queries by default (`select: false`)
- **Credential** — W3C VC format, status enum (verified/pending/revoked/expiring)
- **Identity** — DIDs with key rotation tracking and trust scores
- **Activity** — TTL index, 90-day auto-expiry
- **ProofRequest** — verification request lifecycle (pending/approved/denied)

### Frontend Patterns

- `api.ts` wraps all fetches with JWT Authorization header via `authService.getToken()`
- `SocketContext.tsx` provides shared Socket.io instance; `useSocket.ts` for subscriptions
- `mockData.ts` serves as fallback when backend is offline
- `@` alias resolves to `src/` directory

## Environment Variables (server/.env)

Required: `MONGO_URI`, `SESSION_SECRET`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASS_HASH`

Fallback dev secrets exist in code (`sovereign-dev-secret`, `sovereign-jwt-dev-secret`) — these are intentional for the lecture environment.

## Key Constraints

- This project follows a lecture syllabus (Lectures 1-48). Do not refactor the file structure, remove educational comments, or consolidate files in ways that break the curriculum mapping.
- Server uses CommonJS (`require`/`module.exports`). Client uses ES modules.
- `asyncWrapper` in `errorHandler.js` is used throughout routes — always wrap async route handlers with it.
- Specific routes (e.g., `/stats`, `/proof-requests`) must be declared before parameterized routes (`/:id`) to avoid Express matching conflicts.
