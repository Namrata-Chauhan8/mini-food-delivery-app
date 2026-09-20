import { useNetworkState } from 'expo-network';

export function useOffline(): boolean {
  const state = useNetworkState();
  if (state.isConnected === undefined) return false;
  if (!state.isConnected) return true;
  return state.isInternetReachable === false;
}
