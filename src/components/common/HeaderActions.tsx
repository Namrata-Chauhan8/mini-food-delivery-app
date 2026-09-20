import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';
import { useTheme } from '../../theme/ThemeProvider';
import { countCartItems } from '../../utils/pricing';
import { Text } from './Text';

/** Toggles between light and dark mode, ignoring the system option entirely. */
export function ThemeToggle() {
  const theme = useTheme();
  const setMode = useThemeStore((s) => s.setMode);

  const icon = theme.dark ? 'moon-outline' : 'sunny-outline';

  return (
    <Pressable
      onPress={() => setMode(theme.dark ? 'light' : 'dark')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${theme.dark ? 'dark' : 'light'}. Tap to change.`}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name={icon} size={19} color={theme.colors.text} />
    </Pressable>
  );
}

export function CartButton() {
  const theme = useTheme();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const count = countCartItems(items);

  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `Cart, ${count} items` : 'Cart, empty'}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Ionicons name="cart-outline" size={20} color={theme.colors.text} />
      {count > 0 ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 18,
            height: 18,
            paddingHorizontal: 4,
            borderRadius: 9,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            borderWidth: 2,
            borderColor: theme.colors.bg,
          }}
        >
          <Text variant="caption" style={{ color: theme.colors.onPrimary, fontSize: 10 }}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
