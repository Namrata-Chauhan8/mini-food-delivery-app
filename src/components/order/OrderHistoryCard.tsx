import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { View } from 'react-native';
import { IMAGE_PLACEHOLDER } from '../../data/images';
import { statusFor } from '../../utils/orderStatus';
import { useTheme } from '../../theme/ThemeProvider';
import { Order } from '../../types';
import { formatCurrency, formatItemCount, formatOrderDate, formatOrderId } from '../../utils/format';
import { countCartItems } from '../../utils/pricing';
import { Card, Text } from '../common';
import { OrderStatusPill } from './OrderStatusPill';

type Props = {
  order: Order;
  onPress: (orderId: string) => void;
};

function OrderHistoryCardBase({ order, onPress }: Props) {
  const theme = useTheme();
  const status = statusFor(order);
  const itemCount = countCartItems(order.items);

  return (
    <Card onPress={() => onPress(order.id)} accessibilityLabel={`Order ${order.id}, ${status}`}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <Image
          source={order.restaurantImage}
          placeholder={IMAGE_PLACEHOLDER}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={{
            width: 56,
            height: 56,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.skeleton,
          }}
        />

        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <Text variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>
              {order.restaurantName}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </View>

          <Text variant="small" color="textMuted">
            {formatOrderId(order.id)} · {formatItemCount(itemCount)} ·{' '}
            {formatCurrency(order.pricing.total)}
          </Text>

          <Text variant="small" color="textMuted">
            {formatOrderDate(order.placedAt)}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: theme.spacing.xs }}>
            <OrderStatusPill status={status} />
          </View>
        </View>
      </View>
    </Card>
  );
}

export const OrderHistoryCard = memo(OrderHistoryCardBase);
