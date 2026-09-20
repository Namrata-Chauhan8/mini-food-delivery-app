import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asyncStorage, STORAGE_KEYS } from './storage';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeState = {
  mode: ThemeMode;
  hydrated: boolean;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      hydrated: false,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: STORAGE_KEYS.theme,
      storage: asyncStorage,
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        useThemeStore.setState({ hydrated: true });
        void state;
      },
    },
  ),
);
