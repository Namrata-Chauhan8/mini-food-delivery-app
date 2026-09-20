import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../types';

/**
 * Adding an item from a different restaurant would mix two menus in one order,
 * so we confirm first and then replace the cart — the same pattern Swiggy/Zomato use.
 */
export function useAddToCart(restaurantName: string) {
  const addItem = useCartStore((s) => s.addItem);
  const replaceWithItem = useCartStore((s) => s.replaceWithItem);
  const wouldConflict = useCartStore((s) => s.wouldConflict);
  const currentRestaurantName = useCartStore((s) => s.restaurantName);

  return useCallback(
    (item: MenuItem) => {
      if (!wouldConflict(item.restaurantId)) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        addItem(item, restaurantName);
        return;
      }

      Alert.alert(
        'Start a new order?',
        `Your cart has items from ${currentRestaurantName}. Adding this will clear the cart and start a new order from ${restaurantName}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start new order',
            style: 'destructive',
            onPress: () => {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              replaceWithItem(item, restaurantName);
            },
          },
        ],
      );
    },
    [addItem, replaceWithItem, wouldConflict, currentRestaurantName, restaurantName],
  );
}
