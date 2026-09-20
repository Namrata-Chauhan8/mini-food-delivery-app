import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, SectionList, View } from 'react-native';
import {
  EmptyState,
  ErrorState,
  Loader,
  Screen,
  SearchBar,
  Text,
} from '../../src/components/common';
import { MenuItemRow } from '../../src/components/restaurant/MenuItemRow';
import { RestaurantHeader } from '../../src/components/restaurant/RestaurantHeader';
import { StickyCartBar } from '../../src/components/restaurant/StickyCartBar';
import { fetchRestaurantById } from '../../src/data/api';
import { getMenuSections } from '../../src/data/menus';
import { useAddToCart } from '../../src/hooks/useAddToCart';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { useCartStore } from '../../src/store/cartStore';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import { MenuItem, Restaurant } from '../../src/types';

export default function RestaurantDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 250);

  const isFavorite = useFavoritesStore((s) => s.ids.includes(id));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const cartItems = useCartStore((s) => s.items);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const addToCart = useAddToCart(restaurant?.name ?? '');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRestaurant(await fetchRestaurantById(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Menu sections, filtered by the in-menu search box. */
  const sections = useMemo(() => {
    const all = getMenuSections(id);
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return all;

    return all
      .map((section) => ({
        title: section.title,
        data: section.data.filter(
          (item) =>
            item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.data.length > 0);
  }, [id, debouncedSearch]);

  const qtyByMenuItemId = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cartItems) map.set(item.menuItemId, item.qty);
    return map;
  }, [cartItems]);

  const renderItem = useCallback(
    ({ item }: { item: MenuItem }) => (
      // Rows carry the gutter themselves so the header image stays full-bleed.
      <View style={{ paddingHorizontal: theme.layout.gutter }}>
        <MenuItemRow
          item={item}
          qty={qtyByMenuItemId.get(item.id) ?? 0}
          onAdd={addToCart}
          onIncrement={addToCart}
          onDecrement={decrementItem}
        />
      </View>
    ),
    [qtyByMenuItemId, addToCart, decrementItem, theme.layout.gutter],
  );

  const headerRight = useCallback(
    () => (
      <Pressable
        onPress={() => toggleFavorite(id)}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        accessibilityState={{ selected: isFavorite }}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={23}
          color={theme.colors.primary}
        />
      </Pressable>
    ),
    [id, isFavorite, toggleFavorite, theme.colors.primary],
  );

  const screenOptions = (
    <Stack.Screen
      options={{
        title: restaurant?.name ?? 'Restaurant',
        headerRight: restaurant ? headerRight : undefined,
      }}
    />
  );

  if (loading) {
    return (
      <Screen edges={[]}>
        {screenOptions}
        <Loader label="Loading menu…" />
      </Screen>
    );
  }

  if (error || !restaurant) {
    return (
      <Screen edges={[]}>
        {screenOptions}
        <ErrorState
          message={error ?? 'This restaurant could not be found.'}
          onRetry={() => void load()}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      {screenOptions}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        stickySectionHeadersEnabled
        ListHeaderComponent={
          <View>
            <RestaurantHeader restaurant={restaurant} />
            <View style={{ paddingHorizontal: theme.layout.gutter, paddingBottom: theme.spacing.sm }}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder={`Search in ${restaurant.name}`}
              />
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View
            style={{
              backgroundColor: theme.colors.bg,
              paddingHorizontal: theme.layout.gutter,
              paddingTop: theme.spacing.lg,
              paddingBottom: theme.spacing.sm,
            }}
          >
            <Text variant="h3">
              {section.title}{' '}
              <Text variant="small" color="textMuted">
                ({section.data.length})
              </Text>
            </Text>
          </View>
        )}
        renderSectionFooter={() => <View style={{ height: theme.spacing.sm }} />}
        ListEmptyComponent={
          <EmptyState
            icon="restaurant-outline"
            title="Nothing on the menu matches"
            message={`No dishes matching "${debouncedSearch}". Try another search.`}
            actionLabel="Clear search"
            onAction={() => setSearch('')}
          />
        }
        contentContainerStyle={{
          // Room for the floating cart bar when it is visible.
          paddingBottom: cartItems.length > 0 ? 110 : theme.spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={9}
        extraData={qtyByMenuItemId}
      />

      <StickyCartBar />
    </Screen>
  );
}
