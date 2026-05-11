// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      getAuthHeader: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      login: async (email, password) => {
        const res = await fetch(`${API}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        set({ user: data.user, token: data.token, isAuthenticated: true });
        return data;
      },

      signup: async (email, password, name) => {
        const res = await fetch(`${API}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        set({ user: data.user, token: data.token, isAuthenticated: true });
        return data;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
