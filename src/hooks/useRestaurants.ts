import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchRestaurants } from '../data/api';
import { Restaurant } from '../types';

type Options = {
  search: string;
  categoryId: string | null;
};

export type RestaurantsResult = {
  restaurants: Restaurant[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  refresh: () => void;
  loadMore: () => void;
  retry: () => void;
};

export function useRestaurants({ search, categoryId }: Options): RestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const pageRef = useRef(0);
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (page: number, mode: 'initial' | 'refresh' | 'more') => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      if (mode !== 'more') setError(null);

      try {
        const result = await fetchRestaurants({ search, categoryId, page });
        if (requestIdRef.current !== requestId) return;

        pageRef.current = result.page;
        setHasMore(result.hasMore);
        setTotal(result.total);
        setRestaurants((prev) => (mode === 'more' ? [...prev, ...result.items] : result.items));
        setError(null);
      } catch (e) {
        if (requestIdRef.current !== requestId) return;
        const message = e instanceof Error ? e.message : 'Something went wrong.';
        if (mode !== 'more') setRestaurants([]);
        setError(message);
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    [search, categoryId],
  );

  // Any change to the query resets pagination and reloads from page 0.
  useEffect(() => {
    pageRef.current = 0;
    void load(0, 'initial');
  }, [load]);

  const refresh = useCallback(() => {
    pageRef.current = 0;
    void load(0, 'refresh');
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || refreshing || !hasMore || error) return;
    void load(pageRef.current + 1, 'more');
  }, [load, loading, loadingMore, refreshing, hasMore, error]);

  const retry = useCallback(() => {
    pageRef.current = 0;
    void load(0, 'initial');
  }, [load]);

  return {
    restaurants,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    total,
    refresh,
    loadMore,
    retry,
  };
}
