import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { STATUS_DESCRIPTIONS } from '../../utils/orderStatus';
import { useTheme } from '../../theme/ThemeProvider';
import { ORDER_STATUSES, OrderStatus } from '../../types';
import { Text } from '../common';

const ICONS: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  'Order Placed': 'receipt-outline',
  Accepted: 'checkmark-circle-outline',
  Preparing: 'flame-outline',
  'Out for Delivery': 'bicycle-outline',
  Delivered: 'home-outline',
};

/** Pulsing ring that marks the step currently in progress. */
function ActivePulse({ color }: { color: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.35, { duration: 900 }), -1, true);
  }, [scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 2 - scale.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: 40,
          height: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: color,
        },
        style,
      ]}
    />
  );
}

type Props = {
  currentIndex: number;
  secondsToNext: number | null;
};

export function OrderStatusTimeline({ currentIndex, secondsToNext }: Props) {
  const theme = useTheme();

  return (
    <View style={{ gap: 0 }}>
      {ORDER_STATUSES.map((status, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isPending = index > currentIndex;
        const isLast = index === ORDER_STATUSES.length - 1;

        const accent = isPending ? theme.colors.textMuted : theme.colors.primary;
        const nodeBg = isPending ? theme.colors.surfaceAlt : theme.colors.primary;

        return (
          <View key={status} style={{ flexDirection: 'row', gap: theme.spacing.lg }}>
            {/* Node + connector rail */}
            <View style={{ alignItems: 'center', width: 40 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: nodeBg,
                }}
              >
                {isActive ? <ActivePulse color={theme.colors.primary} /> : null}
                <Ionicons
                  name={isDone ? 'checkmark' : ICONS[status]}
                  size={19}
                  color={isPending ? theme.colors.textMuted : theme.colors.onPrimary}
                />
              </View>

              {!isLast ? (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 34,
                    backgroundColor: isDone ? theme.colors.primary : theme.colors.border,
                  }}
                />
              ) : null}
            </View>

            <View style={{ flex: 1, paddingBottom: isLast ? 0 : theme.spacing.lg }}>
              <Text variant="bodyStrong" style={{ color: isPending ? theme.colors.textMuted : theme.colors.text }}>
                {status}
              </Text>
              <Text variant="small" color="textMuted" style={{ marginTop: 2, lineHeight: 18 }}>
                {STATUS_DESCRIPTIONS[status]}
              </Text>

              {isActive && secondsToNext !== null ? (
                <Text variant="caption" style={{ color: accent, marginTop: 5 }}>
                  NEXT UPDATE IN {secondsToNext}s
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
