import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { CartButton, EmptyState, Screen, Text, ThemeToggle } from '../../src/components/common';
import { OrderHistoryCard } from '../../src/components/order/OrderHistoryCard';
import { useOrdersStore } from '../../src/store/ordersStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Order } from '../../src/types';

export default function OrdersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const orders = useOrdersStore((s) => s.orders);

  const openOrder = useCallback(
    (orderId: string) => router.push({ pathname: '/order/[id]', params: { id: orderId } }),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Order }) => <OrderHistoryCard order={item} onPress={openOrder} />,
    [openOrder],
  );

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          paddingHorizontal: theme.layout.gutter,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="h2">Your Orders</Text>
          <Text variant="small" color="textMuted">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </Text>
        </View>
        <ThemeToggle />
        <CartButton />
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="Once you place an order it will show up here with its live status and full details."
          actionLabel="Order something"
          onAction={() => router.push('/')}
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: theme.layout.gutter,
            paddingBottom: theme.spacing.xxl,
            gap: theme.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={8}
          windowSize={7}
        />
      )}
    </Screen>
  );
}
