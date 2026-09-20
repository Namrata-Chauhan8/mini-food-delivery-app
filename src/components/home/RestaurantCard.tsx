import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { IMAGE_PLACEHOLDER } from '../../data/images';
import { useTheme } from '../../theme/ThemeProvider';
import { Restaurant } from '../../types';
import { formatCurrency, formatDeliveryTime, formatRatingCount } from '../../utils/format';
import { Rating, Text } from '../common';

type Props = {
  restaurant: Restaurant;
  isFavorite: boolean;
  onPress: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

function RestaurantCardBase({ restaurant, isFavorite, onPress, onToggleFavorite }: Props) {
  const theme = useTheme();

  const handleFavorite = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite(restaurant.id);
  };

  return (
    <Pressable
      onPress={() => onPress(restaurant.id)}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name}, rated ${restaurant.rating}, ${restaurant.cuisines.join(', ')}`}
      style={({ pressed }) => ({
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View>
        <Image
          source={restaurant.image}
          placeholder={IMAGE_PLACEHOLDER}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
          style={{ width: '100%', height: 150, backgroundColor: theme.colors.skeleton }}
        />

        {restaurant.promoted ? (
          <View
            style={{
              position: 'absolute',
              top: theme.spacing.sm,
              left: theme.spacing.sm,
              backgroundColor: theme.colors.primary,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 3,
              borderRadius: theme.radius.sm,
            }}
          >
            <Text variant="caption" style={{ color: theme.colors.onPrimary }}>
              PROMOTED
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={handleFavorite}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? `Remove ${restaurant.name} from favorites` : `Add ${restaurant.name} to favorites`
          }
          accessibilityState={{ selected: isFavorite }}
          style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.overlay,
          }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={19}
            color={isFavorite ? theme.colors.primary : '#FFFFFF'}
          />
        </Pressable>
      </View>

      <View style={{ padding: theme.spacing.md, gap: 5 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
          <Text variant="h3" numberOfLines={1} style={{ flex: 1 }}>
            {restaurant.name}
          </Text>
          <Rating value={restaurant.rating} />
        </View>

        <Text variant="small" color="textMuted" numberOfLines={1}>
          {restaurant.cuisines.join(' • ')}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="time-outline" size={13} color={theme.colors.textMuted} />
            <Text variant="small" color="textMuted">
              {formatDeliveryTime(restaurant.deliveryTimeMins)}
            </Text>
          </View>
          <Text variant="small" color="textMuted">
            {formatCurrency(restaurant.priceForTwo)} for two
          </Text>
          <Text variant="small" color="textMuted">
            {formatRatingCount(restaurant.ratingCount)} ratings
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Memoised because the home list re-renders on every keystroke and favourite
 * toggle; without this each card would re-render its image on each change.
 */
export const RestaurantCard = memo(RestaurantCardBase);
