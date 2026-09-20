import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import {
  CartButton,
  EmptyState,
  ErrorState,
  FooterLoader,
  Screen,
  SearchBar,
  SkeletonList,
  Text,
  ThemeToggle,
} from '../../src/components/common';
import { CategoryChips } from '../../src/components/home/CategoryChips';
import { RestaurantCard } from '../../src/components/home/RestaurantCard';
import { CATEGORIES } from '../../src/data/categories';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { useRestaurants } from '../../src/hooks/useRestaurants';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Restaurant } from '../../src/types';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const {
    restaurants,
    loading,
    refreshing,
    loadingMore,
    error,
    total,
    refresh,
    loadMore,
    retry,
  } = useRestaurants({ search: debouncedSearch, categoryId });

  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const openRestaurant = useCallback(
    (id: string) => router.push({ pathname: '/restaurant/[id]', params: { id } }),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Restaurant }) => (
      <RestaurantCard
        restaurant={item}
        isFavorite={favoriteIds.includes(item.id)}
        onPress={openRestaurant}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [favoriteIds, openRestaurant, toggleFavorite],
  );

  const activeCategory = CATEGORIES.find((c) => c.id === categoryId);

  const listHeader = (
    <View style={{ paddingBottom: theme.spacing.sm }}>
      <Text variant="smallStrong" color="textMuted">
        {loading ? 'Finding restaurants…' : `${total} ${total === 1 ? 'restaurant' : 'restaurants'} near you`}
      </Text>
    </View>
  );

  function renderBody() {
    if (loading) {
      return (
        <View style={{ paddingHorizontal: theme.layout.gutter }}>
          <SkeletonList count={4} />
        </View>
      );
    }

    if (error) {
      return <ErrorState message={error} onRetry={retry} />;
    }

    if (restaurants.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="No restaurants found"
          message={
            debouncedSearch
              ? `We couldn't find anything matching "${debouncedSearch}". Try a different dish or cuisine.`
              : `No restaurants in ${activeCategory?.name ?? 'this category'} right now.`
          }
          actionLabel={debouncedSearch || categoryId ? 'Clear filters' : undefined}
          onAction={
            debouncedSearch || categoryId
              ? () => {
                  setSearch('');
                  setCategoryId(null);
                }
              : undefined
          }
        />
      );
    }

    return (
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListFooterComponent={<FooterLoader visible={loadingMore} />}
        contentContainerStyle={{
          paddingHorizontal: theme.layout.gutter,
          paddingBottom: theme.spacing.xxl,
          gap: theme.spacing.lg,
        }}
        numColumns={theme.layout.columns}
        key={`cols-${theme.layout.columns}`}
        columnWrapperStyle={theme.layout.columns > 1 ? { gap: theme.spacing.lg } : undefined}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={7}
      />
    );
  }

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
          <Text variant="caption" color="textMuted">
            DELIVERING TO
          </Text>
          <Text variant="h3" numberOfLines={1}>
            Home · Ahmedabad
          </Text>
        </View>
        <ThemeToggle />
        <CartButton />
      </View>

      <View style={{ paddingHorizontal: theme.layout.gutter }}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <CategoryChips selectedId={categoryId} onSelect={setCategoryId} />

      <View style={{ flex: 1 }}>{renderBody()}</View>
    </Screen>
  );
}
