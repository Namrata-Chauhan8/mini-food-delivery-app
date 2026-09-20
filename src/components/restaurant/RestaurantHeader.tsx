import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View } from 'react-native';
import { IMAGE_PLACEHOLDER } from '../../data/images';
import { useTheme } from '../../theme/ThemeProvider';
import { Restaurant } from '../../types';
import {
  formatCurrency,
  formatDeliveryTime,
  formatRating,
  formatRatingCount,
} from '../../utils/format';
import { Text } from '../common';

function Stat({
  icon,
  value,
  caption,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  caption: string;
}) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <Ionicons name={icon} size={17} color={theme.colors.primary} />
      <Text variant="bodyStrong">{value}</Text>
      <Text variant="caption" color="textMuted">
        {caption}
      </Text>
    </View>
  );
}

export function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
  const theme = useTheme();

  return (
    <View>
      <Image
        source={restaurant.image}
        placeholder={IMAGE_PLACEHOLDER}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
        style={{
          width: '100%',
          height: theme.layout.isTablet ? 260 : 190,
          backgroundColor: theme.colors.skeleton,
        }}
      />

      <View style={{ padding: theme.layout.gutter, gap: theme.spacing.sm }}>
        <Text variant="h1">{restaurant.name}</Text>

        <Text variant="small" color="textMuted">
          {restaurant.cuisines.join(' • ')}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="location-outline" size={14} color={theme.colors.textMuted} />
          <Text variant="small" color="textMuted" style={{ flex: 1 }}>
            {restaurant.address}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: theme.spacing.sm,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surfaceAlt,
          }}
        >
          <Stat
            icon="star"
            value={formatRating(restaurant.rating)}
            caption={`${formatRatingCount(restaurant.ratingCount)} ratings`}
          />
          <View style={{ width: 1, backgroundColor: theme.colors.border }} />
          <Stat
            icon="time-outline"
            value={formatDeliveryTime(restaurant.deliveryTimeMins)}
            caption="Delivery time"
          />
          <View style={{ width: 1, backgroundColor: theme.colors.border }} />
          <Stat
            icon="pricetag-outline"
            value={formatCurrency(restaurant.priceForTwo)}
            caption="For two"
          />
        </View>
      </View>
    </View>
  );
}
