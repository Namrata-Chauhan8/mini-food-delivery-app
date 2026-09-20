import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../theme/ThemeProvider';
import { formatCurrency, formatItemCount } from '../../utils/format';
import { calculateSubtotal, countCartItems } from '../../utils/pricing';
import { Text } from '../common';

/** Floating "N items · ₹X — View cart" bar shown whenever the cart has contents. */
export function StickyCartBar() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);

  if (items.length === 0) return null;

  const count = countCartItems(items);
  const subtotal = calculateSubtotal(items);

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={{
        position: 'absolute',
        left: theme.layout.gutter,
        right: theme.layout.gutter,
        bottom: Math.max(insets.bottom, theme.spacing.md),
      }}
    >
      <Pressable
        onPress={() => router.push('/cart')}
        accessibilityRole="button"
        accessibilityLabel={`View cart, ${count} items, ${formatCurrency(subtotal)}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.lg,
          height: 54,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <View>
          <Text variant="smallStrong" style={{ color: theme.colors.onPrimary }}>
            {formatItemCount(count)}
          </Text>
          <Text variant="caption" style={{ color: theme.colors.onPrimary, opacity: 0.85 }}>
            {formatCurrency(subtotal)} plus taxes
          </Text>
        </View>
        <Text variant="bodyStrong" style={{ color: theme.colors.onPrimary }}>
          View Cart →
        </Text>
      </Pressable>
    </Animated.View>
  );
}
