import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useOrdersStore } from '../store/ordersStore';
import { useThemeStore } from '../store/themeStore';

export function useHydration(): boolean {
  const auth = useAuthStore((s) => s.hydrated);
  const cart = useCartStore((s) => s.hydrated);
  const favorites = useFavoritesStore((s) => s.hydrated);
  const orders = useOrdersStore((s) => s.hydrated);
  const theme = useThemeStore((s) => s.hydrated);

  return auth && cart && favorites && orders && theme;
}
