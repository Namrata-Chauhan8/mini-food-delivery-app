import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useOffline } from '../../hooks/useOffline';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export function OfflineBanner() {
  const theme = useTheme();
  const offline = useOffline();

  if (!offline) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(200)}
      exiting={FadeOutUp.duration(200)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 6,
        backgroundColor: theme.colors.warning,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={14} color="#FFFFFF" />
      <Text variant="caption" style={{ color: '#FFFFFF' }}>
        YOU&apos;RE OFFLINE — CART AND ORDERS ARE SAVED ON THIS DEVICE
      </Text>
    </Animated.View>
  );
}
