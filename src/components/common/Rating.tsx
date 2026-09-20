import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { formatRating } from '../../utils/format';
import { Text } from './Text';

export function Rating({ value, compact = false }: { value: number; compact?: boolean }) {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={`Rated ${formatRating(value)} out of 5`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: compact ? 'transparent' : theme.colors.rating,
        paddingHorizontal: compact ? 0 : 6,
        paddingVertical: compact ? 0 : 2,
        borderRadius: theme.radius.sm,
      }}
    >
      <Ionicons
        name="star"
        size={compact ? 13 : 11}
        color={compact ? theme.colors.rating : '#FFFFFF'}
      />
      <Text
        variant={compact ? 'smallStrong' : 'caption'}
        style={{ color: compact ? theme.colors.text : '#FFFFFF' }}
      >
        {formatRating(value)}
      </Text>
    </View>
  );
}
