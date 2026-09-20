import { TextStyle } from 'react-native';

export const typography = {
  h1: { fontSize: 26, fontWeight: '700', letterSpacing: -0.4 },
  h2: { fontSize: 21, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '500' },
  bodyStrong: { fontSize: 15, fontWeight: '700' },
  small: { fontSize: 13, fontWeight: '500' },
  smallStrong: { fontSize: 13, fontWeight: '700' },
  caption: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
