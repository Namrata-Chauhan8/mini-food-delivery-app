import { MenuItem, Restaurant } from '../types';
import { ALL_MENU_ITEMS } from './menus';
import { RESTAURANTS } from './restaurants';

/**
 * A fake network layer over the local mock data. It exists so the UI has real
 * loading / error / empty states to render instead of reading arrays synchronously.
 *
 * Tune these two constants to demo a specific state:
 *  - set SIMULATED_ERROR_RATE to 1 to always fail (shows ErrorState + Retry)
 *  - set it to 0 for a clean recording
 */
export const SIMULATED_ERROR_RATE = 0.08;
export const SIMULATED_LATENCY_MS = 600;
export const PAGE_SIZE = 6;

export class ApiError extends Error {
  constructor(message = "We couldn't load this right now. Please try again.") {
    super(message);
    this.name = 'ApiError';
  }
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function simulateRequest(shouldFail = Math.random() < SIMULATED_ERROR_RATE) {
  await delay(SIMULATED_LATENCY_MS);
  if (shouldFail) throw new ApiError();
}

export type Page<T> = {
  items: T[];
  page: number;
  hasMore: boolean;
  total: number;
};

function matchesQuery(restaurant: Restaurant, query: string, menu: MenuItem[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (restaurant.name.toLowerCase().includes(q)) return true;
  if (restaurant.cuisines.some((c) => c.toLowerCase().includes(q))) return true;
  // Searching a dish name should surface the restaurants that serve it.
  return menu.some((item) => item.name.toLowerCase().includes(q));
}

export type RestaurantQuery = {
  search?: string;
  categoryId?: string | null;
  page?: number;
};

export async function fetchRestaurants({
  search = '',
  categoryId = null,
  page = 0,
}: RestaurantQuery): Promise<Page<Restaurant>> {
  await simulateRequest();

  const menuByRestaurant = new Map<string, MenuItem[]>();
  for (const item of ALL_MENU_ITEMS) {
    const list = menuByRestaurant.get(item.restaurantId) ?? [];
    list.push(item);
    menuByRestaurant.set(item.restaurantId, list);
  }

  const filtered = RESTAURANTS.filter((restaurant) => {
    if (categoryId && !restaurant.categoryIds.includes(categoryId)) return false;
    return matchesQuery(restaurant, search, menuByRestaurant.get(restaurant.id) ?? []);
  });

  const start = page * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return {
    items,
    page,
    hasMore: start + PAGE_SIZE < filtered.length,
    total: filtered.length,
  };
}

export async function fetchRestaurantById(id: string): Promise<Restaurant> {
  await simulateRequest();
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  if (!restaurant) throw new ApiError('This restaurant is no longer available.');
  return restaurant;
}

/** Dish-level search used by the search screen to show matching items directly. */
export async function fetchMenuItems(search: string): Promise<MenuItem[]> {
  await simulateRequest();
  const q = search.trim().toLowerCase();
  if (!q) return [];
  return ALL_MENU_ITEMS.filter(
    (item) => item.name.toLowerCase().includes(q) || item.section.toLowerCase().includes(q),
  ).slice(0, 20);
}
