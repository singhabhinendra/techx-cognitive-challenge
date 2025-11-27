# Deploying the TechX Cognitive Server

This file provides quick instructions for deploying the server to common hosts.

Render (Docker):
- Create a new Web Service on Render and connect your GitHub repo.
- Use the `Dockerfile` at `server/Dockerfile` (it will build and run on Render).
- Set environment variables: `MONGO_URI`, `JWT_SECRET`, and `PORT` (optional).

Railway:
- Create a new project and connect the repository.
- Set the start command to `node src/index.js`.
- Add environment variables: `MONGO_URI`, `JWT_SECRET`.

Vercel (Frontend):
- For the client, you can use the included `client/vercel.json`.
- Set the Build Command: `npm run build` and Output Directory: `client/dist`.

Deploy keys / secrets
- GitHub Actions deploy jobs rely on repo secrets. Add the following in `Settings -> Secrets`:
	- `RENDER_API_KEY` and `RENDER_SERVICE_ID` (for automatic Render deploys)
	- `VERCEL_TOKEN` (for Vercel deploys)

Local test deployment (recommended for E2E):
- Start a local MongoDB (Docker):

```powershell
docker run -d -p 27017:27017 --name techx-mongo mongo:6.0
```

- Start server with the test DB:

```powershell
cd C:\vscode\games-application\server
$env:MONGO_URI='mongodb://localhost:27017/techx_e2e'
node src/index.js
```

Then start the client dev server and run Playwright E2E as described in the client README.
