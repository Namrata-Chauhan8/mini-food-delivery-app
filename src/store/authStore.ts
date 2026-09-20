import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account } from '../types';
import { createAccountId } from '../utils/id';
import { normalizeEmail } from '../utils/validation';
import { asyncStorage, STORAGE_KEYS } from './storage';


export type SignUpInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthErrorField = 'email' | 'password' | 'form';

export type AuthResult = { ok: true } | { ok: false; field: AuthErrorField; message: string };

type AuthState = {
  accounts: Account[];
  currentUserId: string | null;
  hydrated: boolean;

  signUp: (input: SignUpInput) => AuthResult;
  signIn: (email: string, password: string) => AuthResult;
  signOut: () => void;
  getCurrentUser: () => Account | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: [],
      currentUserId: null,
      hydrated: false,

      signUp: (input) => {
        const email = normalizeEmail(input.email);

        if (get().accounts.some((account) => account.email === email)) {
          return {
            ok: false,
            field: 'email',
            message: 'An account with this email already exists.',
          };
        }

        const account: Account = {
          id: createAccountId(),
          fullName: input.fullName.trim(),
          email,
          phone: input.phone.trim(),
          password: input.password,
          createdAt: Date.now(),
        };

        set((state) => ({
          accounts: [...state.accounts, account],
          currentUserId: account.id,
        }));

        return { ok: true };
      },

      signIn: (email, password) => {
        const account = get().accounts.find((a) => a.email === normalizeEmail(email));

        if (!account || account.password !== password) {
          return { ok: false, field: 'form', message: 'Email or password is incorrect.' };
        }

        set({ currentUserId: account.id });
        return { ok: true };
      },

      signOut: () => set({ currentUserId: null }),

      getCurrentUser: () => {
        const { accounts, currentUserId } = get();
        return accounts.find((account) => account.id === currentUserId) ?? null;
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: asyncStorage,
      partialize: (state) => ({ accounts: state.accounts, currentUserId: state.currentUserId }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hydrated: true });
      },
    },
  ),
);

export const selectIsSignedIn = (state: AuthState): boolean => state.currentUserId !== null;
