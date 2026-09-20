import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage, STORAGE_KEYS } from './storage';

type FavoritesState = {
  /** Stored as an array because JSON has no Set; lookups go through isFavorite(). */
  ids: string[];
  hydrated: boolean;
  toggle: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,

      toggle: (restaurantId) =>
        set((state) => ({
          ids: state.ids.includes(restaurantId)
            ? state.ids.filter((id) => id !== restaurantId)
            : [...state.ids, restaurantId],
        })),

      isFavorite: (restaurantId) => get().ids.includes(restaurantId),

      clear: () => set({ ids: [] }),
    }),
    {
      name: STORAGE_KEYS.favorites,
      storage: asyncStorage,
      partialize: (state) => ({ ids: state.ids }),
      onRehydrateStorage: () => () => {
        useFavoritesStore.setState({ hydrated: true });
      },
    },
  ),
);
