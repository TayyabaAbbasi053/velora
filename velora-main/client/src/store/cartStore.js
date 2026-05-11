// src/store/cartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getId = (item) => item._id || item.id;

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const productId = getId(product);
        const existingItem = items.find(item => getId(item) === productId);

        if (existingItem) {
          set({
            items: items.map(item =>
              getId(item) === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => getId(item) !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map(item =>
              getId(item) === productId ? { ...item, quantity } : item
            )
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(String(item.price).replace('$', ''));
          return total + (isNaN(price) ? 0 : price * item.quantity);
        }, 0).toFixed(2);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
