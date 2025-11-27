import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }
});

// attach token from localStorage for authenticated requests
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("tx_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

// Try to flush any pending scores saved while offline/unauthenticated
export async function flushPendingScores() {
  try {
    const raw = localStorage.getItem("tx_pending_scores");
    if (!raw) return;
    const pending = JSON.parse(raw);
    if (!Array.isArray(pending) || pending.length === 0) return;
    for (const p of pending.slice()) {
      try {
        await api.post("/games/record-score", p);
        // remove from pending after success
        const current = JSON.parse(
          localStorage.getItem("tx_pending_scores") || "[]"
        );
        const filtered = current.filter(
          (c) =>
            !(c.date === p.date && c.game === p.game && c.score === p.score)
        );
        localStorage.setItem("tx_pending_scores", JSON.stringify(filtered));
      } catch (err) {
        // stop trying on first failure to avoid API rate issues
        break;
      }
    }
  } catch (e) {
    // ignore
  }
}

export default api;
