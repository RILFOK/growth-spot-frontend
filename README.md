# Growth Spot — Frontend

React SPA for a digital-services website and its administrative interface. This repository contains a standalone React/Vite implementation; it may differ from the current live iteration of Growth Spot.

## Stack
React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · React Router · Axios · React Hook Form · Zustand.

## Implemented areas
- Public-facing website, legal pages and lead form.
- Administrative interface for leads, users and site settings.
- Integration with a separate REST API.
- Authentication UI and two-factor authentication flows.
- Responsive interface and analytics/SEO integration.

## Local development
Requirements: Node.js and npm. The backend and database are separate services.

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

The API base path defaults to `/api`; configure `VITE_API_URL` for another development endpoint.

## Documentation
- [Overview](docs/frontend/overview.md)
- [Local setup](docs/frontend/setup.md)
- [Architecture](docs/frontend/architecture.md)
- [Routes](docs/frontend/routing.md)
- [Public website](docs/frontend/public-site.md)
- [Admin interface](docs/frontend/admin-panel.md)
- [Auth and 2FA](docs/frontend/auth-and-2fa.md)
- [API integration](docs/frontend/api-integration.md)
- [Deployment](docs/frontend/deployment.md)

## Related project
[Growth Spot — Backend](https://github.com/RILFOK/growth-spot-backend) — Node.js, Express and PostgreSQL.

> The public repository is intended as a source-code sample. Production credentials, database data and private administrative access are not included.
