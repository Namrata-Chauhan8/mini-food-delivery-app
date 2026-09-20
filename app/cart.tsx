import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, EmptyState, Screen, Text } from '../src/components/common';
import { CartRow } from '../src/components/cart/CartRow';
import { PriceSummary } from '../src/components/cart/PriceSummary';
import { selectIsSignedIn, useAuthStore } from '../src/store/authStore';
import { useCartStore } from '../src/store/cartStore';
import { useTheme } from '../src/theme/ThemeProvider';
import { formatCurrency } from '../src/utils/format';
import { calculatePricing, countCartItems } from '../src/utils/pricing';

export default function CartScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = useCartStore((s) => s.items);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const addItemById = useCartStore((s) => s.setQty);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const isSignedIn = useAuthStore(selectIsSignedIn);

  // Money is always derived, never stored.
  const pricing = useMemo(() => calculatePricing(items), [items]);
  const itemCount = countCartItems(items);

  // Checkout needs an account, so guests detour through the login screen, which
  // sends them straight back here once they are signed in.
  const goToCheckout = useMemo(
    () =>
      isSignedIn
        ? ({ pathname: '/checkout' } as const)
        : ({ pathname: '/login', params: { redirect: 'checkout' } } as const),
    [isSignedIn],
  );

  const increment = useCallback(
    (menuItemId: string) => {
      const current = items.find((i) => i.menuItemId === menuItemId);
      if (current) addItemById(menuItemId, current.qty + 1);
    },
    [items, addItemById],
  );

  const confirmClear = useCallback(() => {
    Alert.alert('Clear cart?', 'This will remove all items from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);
  }, [clear]);

  const headerRight = useCallback(
    () =>
      items.length > 0 ? (
        <Pressable
          onPress={confirmClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear cart"
        >
          <Text variant="smallStrong" color="primary">
            Clear
          </Text>
        </Pressable>
      ) : null,
    [items.length, confirmClear],
  );

  if (items.length === 0) {
    return (
      <Screen edges={[]}>
        <Stack.Screen options={{ title: 'Your Cart' }} />
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Browse restaurants and add a few dishes — they'll show up here."
          actionLabel="Browse restaurants"
          onAction={() => router.replace('/')}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Your Cart', headerRight }} />

      <ScrollView
        contentContainerStyle={{
          padding: theme.layout.gutter,
          paddingBottom: theme.spacing.xxl,
          gap: theme.spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <Ionicons name="storefront-outline" size={17} color={theme.colors.primary} />
          <Text variant="bodyStrong" style={{ flex: 1 }} numberOfLines={1}>
            {restaurantName ?? 'Your order'}
          </Text>
          {restaurantId ? (
            <Pressable
              onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: restaurantId } })}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Add more items"
            >
              <Text variant="smallStrong" color="primary">
                + Add more
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={{ gap: theme.spacing.sm }}>
          {items.map((item) => (
            <CartRow
              key={item.menuItemId}
              item={item}
              onIncrement={increment}
              onDecrement={decrementItem}
              onRemove={removeItem}
            />
          ))}
          <Text variant="caption" color="textMuted" style={{ textAlign: 'center', marginTop: 4 }}>
            SWIPE A ROW LEFT TO REMOVE IT
          </Text>
        </View>

        <PriceSummary pricing={pricing} />
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          paddingHorizontal: theme.layout.gutter,
          paddingTop: theme.spacing.md,
          paddingBottom: Math.max(insets.bottom, theme.spacing.md),
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        }}
      >
        <View>
          <Text variant="h3">{formatCurrency(pricing.total)}</Text>
          <Text variant="caption" color="textMuted">
            {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
          </Text>
        </View>
        <Button
          label="Proceed to Checkout"
          onPress={() => router.push(goToCheckout)}
          size="lg"
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}
