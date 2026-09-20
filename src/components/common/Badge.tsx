import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const theme = useTheme();

  const tones: Record<Tone, { bg: string; fg: string }> = {
    neutral: { bg: theme.colors.surfaceAlt, fg: theme.colors.textMuted },
    primary: { bg: theme.colors.primaryMuted, fg: theme.colors.primary },
    success: { bg: theme.dark ? '#143A2C' : '#E4F5EC', fg: theme.colors.success },
    warning: { bg: theme.dark ? '#3A2E14' : '#FBF0DC', fg: theme.colors.warning },
    danger: { bg: theme.dark ? '#3A1C1A' : '#FBE6E4', fg: theme.colors.danger },
  };
  const { bg, fg } = tones[tone];

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 3,
        borderRadius: theme.radius.sm,
        alignSelf: 'flex-start',
      }}
    >
      <Text variant="caption" style={{ color: fg }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

/** The small green/red square Indian food apps use to mark veg and non-veg items. */
export function VegIndicator({ isVeg, size = 14 }: { isVeg: boolean; size?: number }) {
  const theme = useTheme();
  const color = isVeg ? theme.colors.veg : theme.colors.nonVeg;

  return (
    <View
      accessibilityLabel={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      style={{
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: size * 0.45,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
