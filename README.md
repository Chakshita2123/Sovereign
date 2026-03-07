# Sovereign — Own Your Identity

A merged project combining the **VaultID Marketing Website** and **VaultID Dashboard** Figma Make designs into a single React application.

## Running the project

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Routes

| Path | Description |
|---|---|
| `/` | Marketing landing page (Figma Make: VaultID Marketing Website Design) |
| `/dashboard` | Dashboard overview |
| `/dashboard/vault` | Credential Vault |
| `/dashboard/identity` | DID Identity |
| `/dashboard/issuer` | Issuer Portal |

## Tech Stack

- React 18 + TypeScript
- React Router v7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `motion/react` (Framer Motion v12)
- Lucide React icons
- Recharts
- All Radix UI primitives (shadcn/ui)

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── credentials/     # Dashboard credential components
│   │   ├── layout/          # Sidebar, TopCommandBar, DashboardLayout
│   │   ├── marketing/       # All landing page section components
│   │   ├── modals/          # Share credential modal
│   │   └── ui/              # shadcn/ui base components
│   ├── data/
│   │   └── mockData.ts      # Mock credentials, activities, proof requests
│   ├── pages/
│   │   ├── LandingPage.tsx         # Marketing site wrapper
│   │   ├── OverviewPage.tsx        # Dashboard home
│   │   ├── CredentialVaultPage.tsx
│   │   ├── DIDIdentityPage.tsx
│   │   └── IssuerPortalPage.tsx
│   ├── App.tsx
│   └── routes.tsx
└── styles/
    ├── fonts.css
    ├── tailwind.css
    ├── theme.css
    └── index.css
```

## Design System

| Token | Value |
|---|---|
| Page Background | `#050D1A` |
| Sidebar | `#080F1E` |
| Card Surface | `#0A1628` |
| Accent Cyan | `#00C2FF` |
| Success Green | `#00FF88` |
| Warning Amber | `#F5A623` |
| Danger Red | `#FF4444` |
| CTA Gradient | `#00C2FF → #7B2FFF` |
| Font Display | Space Grotesk |
| Font Body | Inter |
| Font Mono | JetBrains Mono |
