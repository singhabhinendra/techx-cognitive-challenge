# TechX Cognitive Challenge

Monorepo containing a Vite + React frontend (`client/`) and an Express + Mongoose backend (`server/`).

Quick dev

```powershell
# frontend
cd C:\vscode\games-application\client
npm install
npm run dev

# backend
cd C:\vscode\games-application\server
npm install
# copy .env.example to .env and set MONGO_URI and JWT_SECRET
npm run dev
```

Tests

- Server unit tests (Jest + mongodb-memory-server):

```powershell
cd C:\vscode\games-application\server
npm ci
npm test
```

- Client unit tests (Jest):

```powershell
cd C:\vscode\games-application\client
npm ci
npm test
```

- Full-stack E2E (Playwright):

1. Start a local MongoDB (Docker) or provide a `MONGO_URI` pointing to a test DB.
2. Start the server pointing to that DB.
3. Start the client dev server.
4. Run Playwright tests from `client/`.

CI and Deploy

- The repo contains GitHub Actions workflows to run server tests, build the client, and run Playwright E2E.
- Manual deploy workflows are available for Render and Vercel; automatic deploy-on-main is also configured and requires repo secrets.
