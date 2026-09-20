import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, MenuItem } from '../types';
import { asyncStorage, STORAGE_KEYS } from './storage';

type CartState = {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  hydrated: boolean;

  addItem: (item: MenuItem, restaurantName: string) => void;
  replaceWithItem: (item: MenuItem, restaurantName: string) => void;
  decrementItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  setQty: (menuItemId: string, qty: number) => void;
  clear: () => void;

  wouldConflict: (restaurantId: string) => boolean;
  getQty: (menuItemId: string) => number;
};

function toCartItem(item: MenuItem): CartItem {
  return {
    menuItemId: item.id,
    restaurantId: item.restaurantId,
    name: item.name,
    price: item.price,
    image: item.image,
    isVeg: item.isVeg,
    qty: 1,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,
      hydrated: false,

      addItem: (item, restaurantName) =>
        set((state) => {
          const existing = state.items.find((i) => i.menuItemId === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItemId === item.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return {
            items: [...state.items, toCartItem(item)],
            restaurantId: item.restaurantId,
            restaurantName,
          };
        }),

      replaceWithItem: (item, restaurantName) =>
        set({
          items: [toCartItem(item)],
          restaurantId: item.restaurantId,
          restaurantName,
        }),

      decrementItem: (menuItemId) =>
        set((state) => {
          const existing = state.items.find((i) => i.menuItemId === menuItemId);
          if (!existing) return state;

          const items =
            existing.qty <= 1
              ? state.items.filter((i) => i.menuItemId !== menuItemId)
              : state.items.map((i) =>
                  i.menuItemId === menuItemId ? { ...i, qty: i.qty - 1 } : i,
                );

          return items.length === 0
            ? { items, restaurantId: null, restaurantName: null }
            : { items };
        }),

      removeItem: (menuItemId) =>
        set((state) => {
          const items = state.items.filter((i) => i.menuItemId !== menuItemId);
          return items.length === 0
            ? { items, restaurantId: null, restaurantName: null }
            : { items };
        }),

      setQty: (menuItemId, qty) => {
        if (qty <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.menuItemId === menuItemId ? { ...i, qty } : i)),
        }));
      },

      clear: () => set({ items: [], restaurantId: null, restaurantName: null }),

      wouldConflict: (restaurantId) => {
        const current = get().restaurantId;
        return current !== null && current !== restaurantId && get().items.length > 0;
      },

      getQty: (menuItemId) => get().items.find((i) => i.menuItemId === menuItemId)?.qty ?? 0,
    }),
    {
      name: STORAGE_KEYS.cart,
      storage: asyncStorage,
      partialize: (state) => ({
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
      }),
      onRehydrateStorage: () => () => {
        useCartStore.setState({ hydrated: true });
      },
    },
  ),
);
