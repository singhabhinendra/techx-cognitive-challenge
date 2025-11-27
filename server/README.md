# TechX Cognitive Challenge — Backend (server)

This folder contains the Node + Express + Mongoose backend for TechX Cognitive Challenge.

Quick start (Windows PowerShell):

```powershell
cd C:\vscode\games-application\server
npm install
cp .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm run dev
```

API endpoints (basic):
- `POST /api/auth/signup` — body: `{ name, email, password }`
- `POST /api/auth/login` — body: `{ email, password }`
- `POST /api/games/start-session` — protected
- `POST /api/games/record-score` — protected
- `GET /api/games/leaderboard/:game` — public
