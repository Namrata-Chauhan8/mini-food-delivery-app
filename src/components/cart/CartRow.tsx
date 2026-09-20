import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { IMAGE_PLACEHOLDER } from '../../data/images';
import { useTheme } from '../../theme/ThemeProvider';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { QuantityStepper, Text, VegIndicator } from '../common';

type Props = {
  item: CartItem;
  onIncrement: (menuItemId: string) => void;
  onDecrement: (menuItemId: string) => void;
  onRemove: (menuItemId: string) => void;
};

function CartRowBase({ item, onIncrement, onDecrement, onRemove }: Props) {
  const theme = useTheme();

  const renderRightActions = (
    _progress: SharedValue<number>,
    translation: SharedValue<number>,
  ) => <DeleteAction translation={translation} onPress={() => onRemove(item.menuItemId)} />;

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={{ backgroundColor: theme.colors.danger, borderRadius: theme.radius.md }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
        }}
      >
        <Image
          source={item.image}
          placeholder={IMAGE_PLACEHOLDER}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={{
            width: 56,
            height: 56,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.colors.skeleton,
          }}
        />

        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <VegIndicator isVeg={item.isVeg} size={12} />
            <Text variant="bodyStrong" numberOfLines={2} style={{ flex: 1 }}>
              {item.name}
            </Text>
          </View>
          <Text variant="small" color="textMuted">
            {formatCurrency(item.price)} each
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', gap: theme.spacing.sm }}>
          <QuantityStepper
            qty={item.qty}
            size="sm"
            label={item.name}
            onIncrement={() => onIncrement(item.menuItemId)}
            onDecrement={() => onDecrement(item.menuItemId)}
          />
          <Text variant="bodyStrong">{formatCurrency(item.price * item.qty)}</Text>
        </View>
      </View>
    </Swipeable>
  );
}

/** Red "Remove" panel revealed by swiping a row left. */
function DeleteAction({
  translation,
  onPress,
}: {
  translation: SharedValue<number>;
  onPress: () => void;
}) {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translation.value + 88 }],
  }));

  return (
    <Animated.View style={[{ width: 88 }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Remove item from cart"
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          backgroundColor: theme.colors.danger,
        }}
      >
        <Ionicons name="trash-outline" size={19} color="#FFFFFF" />
        <Text variant="caption" style={{ color: '#FFFFFF' }}>
          REMOVE
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export const CartRow = memo(CartRowBase);
