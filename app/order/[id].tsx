import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PriceSummary } from '../../src/components/cart/PriceSummary';
import { Button, EmptyState, Screen, Text } from '../../src/components/common';
import { OrderStatusTimeline } from '../../src/components/order/OrderStatusTimeline';
import { IMAGE_PLACEHOLDER } from '../../src/data/images';
import { useOrderStatus } from '../../src/hooks/useOrderStatus';
import { useOrdersStore } from '../../src/store/ordersStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import { PaymentMethod } from '../../src/types';
import { formatCurrency, formatItemCount, formatOrderDate, formatOrderId } from '../../src/utils/format';
import { countCartItems } from '../../src/utils/pricing';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Credit / Debit Card',
  wallet: 'Wallet',
  cash: 'Cash on Delivery',
};

function Card({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
      }}
    >
      {children}
    </View>
  );
}

export default function OrderTrackingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Subscribing to the array keeps this re-rendering when the order is updated.
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === id));
  const { status, statusIndex, isComplete, secondsToNext } = useOrderStatus(order);

  if (!order) {
    return (
      <Screen edges={[]}>
        <Stack.Screen options={{ title: 'Order' }} />
        <EmptyState
          icon="receipt-outline"
          title="Order not found"
          message="We couldn't find this order. It may have been cleared from this device."
          actionLabel="Back to orders"
          onAction={() => router.replace('/orders')}
        />
      </Screen>
    );
  }

  const itemCount = countCartItems(order.items);

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: formatOrderId(order.id) }} />

      <ScrollView
        contentContainerStyle={{
          padding: theme.layout.gutter,
          paddingBottom: theme.spacing.xxl,
          gap: theme.spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Live status banner */}
        <Animated.View entering={FadeIn.duration(260)}>
          <View
            style={{
              backgroundColor: isComplete ? theme.colors.success : theme.colors.primary,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
            }}
          >
            <Ionicons
              name={isComplete ? 'checkmark-done-circle' : 'time-outline'}
              size={30}
              color="#FFFFFF"
            />
            <View style={{ flex: 1 }}>
              <Text variant="caption" style={{ color: '#FFFFFF', opacity: 0.85 }}>
                {isComplete ? 'ORDER COMPLETE' : 'CURRENT STATUS'}
              </Text>
              <Text variant="h3" style={{ color: '#FFFFFF' }}>
                {status}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Restaurant */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
            <Image
              source={order.restaurantImage}
              placeholder={IMAGE_PLACEHOLDER}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              style={{
                width: 52,
                height: 52,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.skeleton,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong" numberOfLines={1}>
                {order.restaurantName}
              </Text>
              <Text variant="small" color="textMuted">
                {formatItemCount(itemCount)} · {formatOrderDate(order.placedAt)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Progress */}
        <Card>
          <Text variant="h3" style={{ marginBottom: theme.spacing.sm }}>
            Order Progress
          </Text>
          <OrderStatusTimeline currentIndex={statusIndex} secondsToNext={secondsToNext} />
        </Card>

        {/* Items */}
        <Card>
          <Text variant="h3">Items</Text>
          {order.items.map((item) => (
            <View
              key={item.menuItemId}
              style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}
            >
              <Text variant="small" color="textMuted" style={{ flex: 1 }} numberOfLines={1}>
                {item.qty} × {item.name}
              </Text>
              <Text variant="small">{formatCurrency(item.price * item.qty)}</Text>
            </View>
          ))}
        </Card>

        {/* Delivery details */}
        <Card>
          <Text variant="h3">Delivery Details</Text>
          <Text variant="bodyStrong">{order.delivery.fullName}</Text>
          <Text variant="small" color="textMuted">
            {order.delivery.phone}
          </Text>
          <Text variant="small" color="textMuted" style={{ lineHeight: 19 }}>
            {order.delivery.address}
          </Text>
          {order.delivery.instructions ? (
            <View
              style={{
                marginTop: theme.spacing.xs,
                padding: theme.spacing.sm,
                borderRadius: theme.radius.sm,
                backgroundColor: theme.colors.surfaceAlt,
              }}
            >
              <Text variant="caption" color="textMuted">
                INSTRUCTIONS
              </Text>
              <Text variant="small">{order.delivery.instructions}</Text>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: theme.spacing.xs,
            }}
          >
            <Ionicons name="card-outline" size={15} color={theme.colors.textMuted} />
            <Text variant="small" color="textMuted">
              Paid via {PAYMENT_LABELS[order.delivery.paymentMethod]}
            </Text>
          </View>
        </Card>

        <PriceSummary pricing={order.pricing} />

        <Button
          label="Back to Home"
          variant="secondary"
          size="lg"
          onPress={() => router.replace('/')}
          fullWidth
        />
      </ScrollView>
    </Screen>
  );
}
