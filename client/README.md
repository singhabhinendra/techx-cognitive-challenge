# TechX Cognitive Challenge — Frontend (client)

This folder contains the Vite + React frontend for the TechX Cognitive Challenge.

Quick start (Windows PowerShell):

```powershell
cd C:\vscode\games-application\client
npm install
npx playwright install --with-deps   # only if running E2E locally
npm run dev
```

Environment variables
- Create a `.env` with `VITE_API_BASE` pointing to your backend API (e.g. `http://localhost:4000` or production API).

Run tests
- Unit tests (Jest):

```powershell
cd C:\vscode\games-application\client
npm ci
npm test
```

- E2E tests (Playwright) — runs tests against a running frontend and backend. See server README for starting a test backend (Mongo required). Example:

```powershell
# In one terminal: start server (see server README)
# In another terminal: start client dev server
cd C:\vscode\games-application\client
npm ci
npx playwright install --with-deps
npm run test:e2e
```

Notes
- This scaffold includes a working Memory Match game under `/games/memory-match` as an example.
- Add sound files under `public/sounds/` and wire them into components for audio feedback.
