# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cloud Mail is an email service built on Cloudflare Workers. It's a monorepo with two sub-projects:

- **mail-vue** — Vue 3 frontend (Vite + Element Plus + Pinia)
- **mail-worker** — Cloudflare Worker backend (Hono web framework + Drizzle ORM + D1/KV/R2)

## Development Commands

### Frontend (mail-vue)
```bash
pnpm install          # install dependencies
pnpm dev              # dev server (Vite, port 3001, proxies to localhost:8787)
pnpm build            # production build (--mode release)
```

### Backend (mail-worker)
```bash
pnpm install          # install dependencies
pnpm dev              # local dev via wrangler (uses wrangler-dev.toml)
pnpm test             # deploy to test env (wrangler-test.toml)
pnpm deploy           # deploy to production (wrangler.toml)
```

### Testing
```bash
# In mail-worker:
pnpm vitest           # run worker tests (uses @cloudflare/vitest-pool-workers)
```

The frontend has no test setup. Tests exist only in `mail-worker/test/`.

## Architecture

### Request Flow
1. `mail-worker/src/index.js` is the Cloudflare Worker entry point
2. Requests to `/api/*` are stripped of the `/api` prefix and routed to the Hono app (`src/hono/webs.js`)
3. Static/attachment paths (`/static/`, `/attachments/`) are served from R2 via `kvObjService`
4. All other requests serve the Vue SPA from `env.assets`

### Backend Layer Structure (mail-worker/src/)
- **hono/** — Hono app setup (`hono.js` base, `webs.js` imports all API routes)
- **api/** — Route handlers, each file registers routes on the shared Hono app
- **service/** — Business logic layer
- **dao/** — Data access (Drizzle ORM over Cloudflare D1)
- **entity/** — Database table definitions (Drizzle schema)
- **email/** — Inbound email handler (Cloudflare Email Routing)
- **security/** — JWT auth middleware + permission system (route-based RBAC)
- **model/** — Standardized response wrapper (`result.js`)
- **i18n/** — Server-side i18n (Chinese + English)
- **init/** — Database schema migration on deploy

### Frontend Layer Structure (mail-vue/src/)
- **views/** — Page components (email, content, send, draft, login, settings, etc.)
- **layout/** — App shell with collapsible sidebar, header, main area
- **store/** — Pinia stores (ui, user, email, account, role, setting, writer, draft, send)
- **composables/** — Vue composables (useTheme for dark/light/system theme)
- **request/** — Axios API modules matching backend routes
- **router/** — Vue Router with auth guard (redirects to /login if no token)
- **db/** — Client-side IndexedDB via Dexie (draft + attachment storage)
- **perm/** — Directive for frontend permission checks
- **i18n/** — Client-side i18n (zh + en)

### Key Patterns
- **Auth**: JWT tokens stored in localStorage, verified via KV-backed session store on every API request
- **Permissions**: Route-based RBAC — `security.js` maps API paths to permission keys, checks user roles
- **Theme**: Three modes (light/dark/system) managed by `useTheme.js` composable + `ui.js` store, persisted via pinia-plugin-persistedstate
- **Sidebar**: Desktop uses collapse/expand state; mobile uses drawer overlay — separate state in `ui.js`
- **Email sending**: Via Resend API or Cloudflare's native email sending
- **Attachments**: Stored in R2 object storage (or S3-compatible), referenced by content-addressed keys
- **PWA**: Configured via vite-plugin-pwa

### Cloudflare Services Used
- **D1** — SQLite database (users, emails, accounts, roles, settings)
- **KV** — Auth sessions, public tokens, caching
- **R2** — Attachment/object storage
- **Email Routing** — Inbound email processing
- **Cron Triggers** — Daily cleanup tasks (clear expired records, reset send counts)

## Environment Configuration

- `mail-vue/.env.dev` — Frontend dev config (API base URL: `http://127.0.0.1:8787/api`)
- `mail-vue/.env.release` — Production build config
- `mail-worker/wrangler.toml` — Production Worker config (D1, KV, R2 bindings commented out)
- `mail-worker/wrangler-dev.toml` — Local dev config (real D1/KV IDs for local testing)
- `mail-worker/wrangler-test.toml` — Test environment config

**Do not commit** `wrangler-dev.toml` or `wrangler-test.toml` — they contain sensitive IDs.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy-cloudflare.yml`) triggers on push to `main` when `mail-worker/**` or `mail-vue/**` change. It:
1. Installs deps with pnpm
2. Injects secrets into `wrangler-action.toml`
3. Creates D1/KV databases if they don't exist
4. Deploys the Worker (which builds the Vue frontend via the `[build]` command in wrangler.toml)
5. Calls `/api/init/{JWT_SECRET}` to initialize the database schema

## i18n

Both frontend and backend support Chinese (zh) and English (en). Frontend uses vue-i18n; backend uses a custom i18n module.
