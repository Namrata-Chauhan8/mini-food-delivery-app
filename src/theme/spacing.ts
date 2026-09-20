export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Layout breakpoints. Screens read these through `useTheme().layout` so the same
 * component can render one column on a phone and two on a tablet.
 */
export const breakpoints = {
  phone: 0,
  largePhone: 400,
  tablet: 700,
} as const;

export function columnsForWidth(width: number): number {
  if (width >= breakpoints.tablet) return 2;
  return 1;
}

export function gutterForWidth(width: number): number {
  if (width >= breakpoints.tablet) return spacing.xl;
  return spacing.lg;
}
