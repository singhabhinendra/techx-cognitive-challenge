Deployment & Security Checklist

This file documents recommended, secure steps to deploy the app to Render + MongoDB Atlas and what to do after secrets were exposed.

1) Prepare Atlas
- Create a MongoDB user in Atlas (Project → Database Access → Add New Database User).
  - Give it a password and the appropriate role (readWrite on the DB used by the app).
- Network Access (Atlas → Network Access):
  - For quick testing: temporarily add `0.0.0.0/0`.
  - For production: restrict to specific IP ranges or use VPC peering.
- Copy the connection string from Atlas (Connect → Connect your application). Replace `<password>` with the actual password.
- URL-encode any special characters in the password (e.g., `@` → `%40`).
- Include a database name and options, for example:
  - `mongodb+srv://<user>:<encoded-password>@<cluster>.mongodb.net/techx_prod?retryWrites=true&w=majority`

2) Render — set environment variables (via dashboard)
- Open Render → Services → select `techx-cognitive-server`.
- Go to the Environment / Environment Variables section.
- Add the following env var:
  - Key: `MONGO_URI`
  - Value: the full encoded Atlas URI (see above)
- Add any other required secrets (for example `JWT_SECRET`) here.
- Save.

3) Redeploy the service
- In the Render service page click **Manual Deploy** → choose **Deploy latest commit** (or equivalent 'redeploy') so the service restarts and picks up env vars.
- Watch the Logs (Live): you should see `MongoDB connected` and `Server running on port ...`.

4) If connection fails — checklist
- If logs say `Could not connect to any servers ...` or `MongoNetworkError`, check Atlas IP Access List.
- If logs say `Authentication failed` check username/password and correct URL-encoding.
- Confirm the exact env var name `MONGO_URI` (the app reads `process.env.MONGO_URI`).

5) Security: rotate exposed secrets (do this immediately)
- MongoDB Atlas user:
  - In Atlas → Database Access → edit the user → change password → copy and encode it.
  - Update Render `MONGO_URI` with the new encoded password and redeploy.
- Render API keys:
  - In Render → Account → API Keys → Revoke the old key exposed here.
  - Generate a new key if you need automation.

6) Tighten production network access
- Remove `0.0.0.0/0` after testing.
- For production, use one of:
  - Private networking / VPC peering between Render and Atlas (recommended), or
  - Restrict to stable IP ranges provided by your host (if available), or
  - Use a separate gateway that can be whitelisted by Atlas.

7) Optional repo cleanup
- `render.yaml` in repo root defines build/start commands for client and server. Keep this file to let Render build services in subfolders.
- The server `package.json` should not require a `build` script since the server doesn't have a build step.

8) Useful commands (local)
- Local test of the connection string (PowerShell):

```powershell
$env:MONGO_URI='mongodb+srv://<user>:<encoded-password>@<cluster>.mongodb.net/techx_prod?retryWrites=true&w=majority'
cd server
node src/index.js
```

- Trigger a redeploy via Render API (requires a valid API key):

```powershell
$env:RENDER_API_KEY = '<NEW_RENDER_API_KEY>'
Invoke-RestMethod -Uri "https://api.render.com/v1/services/<SERVICE_ID>/deploys" -Method Post -Headers @{ Authorization = "Bearer $env:RENDER_API_KEY"; "Content-Type" = "application/json" } -Body '{}'
```

9) Afterword
- Rotate secrets you posted in the chat immediately and update Render with the new values.
- If you'd like, I can create a small script to automate secure deploys (CI) that uses Render secrets and doesn't expose keys in the repo.
