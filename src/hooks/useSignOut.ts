import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useOrdersStore } from '../store/ordersStore';

/**
 * Signs out after a confirmation, and clears the stores that hold the account's
 * data. Cart, favorites and orders are device-wide rather than namespaced per
 * account, so wiping them on sign-out is what keeps the next user from seeing
 * the previous one's history.
 */
export function useSignOut(): () => void {
  const router = useRouter();

  return useCallback(() => {
    Alert.alert(
      'Sign out?',
      'Your cart, favorites and order history are stored on this device and will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            useAuthStore.getState().signOut();
            useCartStore.getState().clear();
            useFavoritesStore.getState().clear();
            useOrdersStore.getState().clear();
            router.replace('/(tabs)');
          },
        },
      ],
    );
  }, [router]);
}
