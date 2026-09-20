import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Single AsyncStorage adapter shared by every persisted store, so all
 * persistence goes through one place and is easy to swap or inspect.
 */
export const asyncStorage = createJSONStorage(() => AsyncStorage);

export const STORAGE_KEYS = {
  auth: 'fda.auth.v1',
  cart: 'fda.cart.v1',
  favorites: 'fda.favorites.v1',
  orders: 'fda.orders.v1',
  theme: 'fda.theme.v1',
} as const;
