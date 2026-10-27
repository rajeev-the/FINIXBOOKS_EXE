# FinixBooks Web UI

React + Vite front-end for **FinixBooks — Tally Connector Web Edition**.

The complete product specification, feature-parity matrix, role-management model, and API reference live in the project root:

➡️ **[../../README.md](../../README.md)**

## Quick start

```bash
npm install
npm run vite:dev     # browser at http://localhost:5173
```

Create a `.env` file:

```dotenv
VITE_API_URL=http://localhost:3000
VITE_EXE_BACKEND_URL=http://localhost:3001
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run vite:dev` | Web dev server |
| `npm run dev` | Vite + Electron desktop shell |
| `npm run build` | Production web bundle (`dist/`) |
| `npm run build:exe` | Windows installer (`dist-exe/`) |
| `npm run lint` | Oxlint |
| `npm run preview` | Preview the production build |

## Current pages

`/login`, `/signup`, `/companies`, `/organization`, `/user`, `/sync`, `/tutorial`, `/settings`

## Target modules

Dashboard · financial statements · sales & receivables · purchases & payables · inventory & masters · GST · banking · vouchers & OCR · AI insights · CRM · users · **roles & permissions** · notifications

See the root README for routes, permission keys, and the RBAC design.
