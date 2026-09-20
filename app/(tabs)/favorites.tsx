import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import {
  CartButton,
  EmptyState,
  Screen,
  Text,
  ThemeToggle,
} from '../../src/components/common';
import { RestaurantCard } from '../../src/components/home/RestaurantCard';
import { RESTAURANTS } from '../../src/data/restaurants';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Restaurant } from '../../src/types';

export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();

  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const favorites = useMemo(
    () => RESTAURANTS.filter((r) => favoriteIds.includes(r.id)),
    [favoriteIds],
  );

  const openRestaurant = useCallback(
    (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } }),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Restaurant }) => (
      <RestaurantCard
        restaurant={item}
        isFavorite
        onPress={openRestaurant}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [openRestaurant, toggleFavorite],
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
          <Text variant="h2">Favorites</Text>
          <Text variant="small" color="textMuted">
            {favorites.length} saved {favorites.length === 1 ? 'restaurant' : 'restaurants'}
          </Text>
        </View>
        <ThemeToggle />
        <CartButton />
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          message="Tap the heart on any restaurant to save it here for quick access later."
          actionLabel="Browse restaurants"
          onAction={() => router.push('/')}
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: theme.layout.gutter,
            paddingBottom: theme.spacing.xxl,
            gap: theme.spacing.lg,
          }}
          numColumns={theme.layout.columns}
          key={`cols-${theme.layout.columns}`}
          columnWrapperStyle={theme.layout.columns > 1 ? { gap: theme.spacing.lg } : undefined}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={4}
          windowSize={7}
        />
      )}
    </Screen>
  );
}
