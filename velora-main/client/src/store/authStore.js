// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password) => {
        // Demo login - in production, this would call an API
        if (email && password) {
          set({
            user: { email, name: email.split('@')[0] },
            isAuthenticated: true
          });
          return true;
        }
        return false;
      },
      signup: (email, password, name) => {
        set({
          user: { email, name },
          isAuthenticated: true
        });
        return true;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;