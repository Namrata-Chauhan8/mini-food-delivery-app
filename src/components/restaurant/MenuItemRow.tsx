import { Image } from 'expo-image';
import { memo } from 'react';
import { View } from 'react-native';
import { IMAGE_PLACEHOLDER } from '../../data/images';
import { useTheme } from '../../theme/ThemeProvider';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Button, QuantityStepper, Text, VegIndicator } from '../common';

type Props = {
  item: MenuItem;
  qty: number;
  onAdd: (item: MenuItem) => void;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (menuItemId: string) => void;
};

function MenuItemRowBase({ item, qty, onAdd, onIncrement, onDecrement }: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <VegIndicator isVeg={item.isVeg} />
        <Text variant="bodyStrong">{item.name}</Text>
        <Text variant="bodyStrong" color="text">
          {formatCurrency(item.price)}
        </Text>
        <Text variant="small" color="textMuted" numberOfLines={2} style={{ lineHeight: 18 }}>
          {item.description}
        </Text>
      </View>

      <View style={{ width: 104, alignItems: 'center' }}>
        <Image
          source={item.image}
          placeholder={IMAGE_PLACEHOLDER}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          style={{
            width: 104,
            height: 88,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.skeleton,
          }}
        />

        {/* Pulled up so the control overlaps the image, like typical menu UIs. */}
        <View style={{ marginTop: -16 }}>
          {qty === 0 ? (
            <Button
              label="ADD"
              size="sm"
              variant="ghost"
              onPress={() => onAdd(item)}
              accessibilityHint={`Add ${item.name} to cart`}
              style={{
                minWidth: 88,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.primary,
              }}
            />
          ) : (
            <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.sm }}>
              <QuantityStepper
                qty={qty}
                size="sm"
                label={item.name}
                onIncrement={() => onIncrement(item)}
                onDecrement={() => onDecrement(item.id)}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export const MenuItemRow = memo(MenuItemRowBase);
