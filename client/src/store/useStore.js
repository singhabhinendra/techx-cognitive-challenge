import create from "zustand";

const initialUser = (() => {
  try {
    const raw = localStorage.getItem("tx_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
})();

const initialToken = (() => localStorage.getItem("tx_token") || null)();

export const useStore = create((set) => ({
  user: initialUser,
  token: initialToken,
  setUser: (user, token) => {
    try {
      localStorage.setItem("tx_user", JSON.stringify(user));
      localStorage.setItem("tx_token", token);
    } catch (e) {}
    set({ user, token });
  },
  setToken: (token) => {
    try {
      if (token) localStorage.setItem("tx_token", token);
      else localStorage.removeItem("tx_token");
    } catch (e) {}
    set({ token });
  },
  clearUser: () => {
    try {
      localStorage.removeItem("tx_user");
      localStorage.removeItem("tx_token");
    } catch (e) {}
    set({ user: null, token: null });
  },
  lastScore: null,
  setLastScore: (s) => set({ lastScore: s })
}));
