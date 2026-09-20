import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { TypographyVariant } from '../../theme/typography';

type ColorKey = 'text' | 'textMuted' | 'primary' | 'success' | 'danger' | 'warning' | 'onPrimary';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorKey;
  style?: StyleProp<TextStyle>;
};

/**
 * Themed text. Every string in the app goes through here so light/dark colours
 * and the type scale stay consistent without repeating styles in each screen.
 */
export function Text({ variant = 'body', color = 'text', style, ...rest }: TextProps) {
  const theme = useTheme();
  return (
    <RNText
      {...rest}
      style={[theme.typography[variant], { color: theme.colors[color] }, style]}
    />
  );
}
