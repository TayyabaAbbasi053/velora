import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './authStore';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // array of product IDs

      isInWishlist: (productId) => get().items.includes(productId),

      fetchWishlist: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;
        try {
          const res = await fetch(`${API}/api/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const products = await res.json();
            set({ items: products.map(p => p._id) });
          }
        } catch {
          // silently fail
        }
      },

      toggle: async (productId) => {
        const { token } = useAuthStore.getState();
        if (!token) return;
        const inList = get().isInWishlist(productId);

        // Optimistic update
        if (inList) {
          set({ items: get().items.filter(id => id !== productId) });
        } else {
          set({ items: [...get().items, productId] });
        }

        try {
          const res = await fetch(`${API}/api/wishlist/${productId}`, {
            method: inList ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error();
        } catch {
          // Revert on failure
          if (inList) {
            set({ items: [...get().items, productId] });
          } else {
            set({ items: get().items.filter(id => id !== productId) });
          }
        }
      },

      clear: () => set({ items: [] }),
    }),
    { name: 'wishlist-storage' }
  )
);

export default useWishlistStore;
