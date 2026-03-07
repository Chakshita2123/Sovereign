# Sovereign — Own Your Identity

A Self-Sovereign Identity (SSI) wallet platform UI built with React + TypeScript + Vite + Tailwind CSS.

## Features

- **Landing Page** — Marketing site with ZKP interactive demo
- **Overview Dashboard** — KPI stats, proof request handling, activity feed
- **Credential Vault** — Full credential management with ZKP field toggling
- **DID Identity** — DID document viewer, key management
- **Issuer Portal** — Bulk issuance, analytics, credential templates
- **Share Modal** — 3-step credential sharing with QR/NFC/deep-link

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 18 + TypeScript
- React Router v6
- Tailwind CSS v3
- Recharts (area charts)
- Lucide React (icons)

## Design System

| Token       | Value     |
|-------------|-----------|
| Background  | `#050D1A` |
| Surface     | `#0A1628` |
| Cyan Accent | `#00C2FF` |
| Green       | `#00FF88` |
| Purple      | `#7B2FFF` |
| Font Display| Space Grotesk |
| Font Body   | Inter     |
| Font Mono   | JetBrains Mono |

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx       # Marketing site
│   ├── OverviewPage.tsx      # Dashboard home
│   ├── CredentialVaultPage.tsx
│   ├── DIDIdentityPage.tsx
│   └── IssuerPortalPage.tsx
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx  # Sidebar + TopBar
│   └── modals/
│       └── ShareModal.tsx
├── data/
│   └── mock.ts               # Mock data
└── index.css                 # Global styles
```
