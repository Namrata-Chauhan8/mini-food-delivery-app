export type ColorScheme = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryMuted: string;
  onPrimary: string;
  success: string;
  warning: string;
  danger: string;
  rating: string;
  veg: string;
  nonVeg: string;
  skeleton: string;
  overlay: string;
};

export const lightColors: ColorScheme = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F5F7',
  border: '#E4E6EB',
  text: '#16181D',
  textMuted: '#6B7280',
  textInverse: '#FFFFFF',
  primary: '#F04A2A',
  primaryMuted: '#FDECE8',
  onPrimary: '#FFFFFF',
  success: '#12855A',
  warning: '#B26A00',
  danger: '#D1382C',
  rating: '#1BA672',
  veg: '#12855A',
  nonVeg: '#B5382C',
  skeleton: '#E9EBEF',
  overlay: 'rgba(0,0,0,0.45)',
};

export const darkColors: ColorScheme = {
  bg: '#0E1013',
  surface: '#181B20',
  surfaceAlt: '#22262D',
  border: '#2E333B',
  text: '#F2F4F7',
  textMuted: '#9BA3AF',
  textInverse: '#16181D',
  primary: '#FF6A4D',
  primaryMuted: '#3A1F19',
  onPrimary: '#16181D',
  success: '#2FBE85',
  warning: '#E0A038',
  danger: '#F2635A',
  rating: '#2FBE85',
  veg: '#2FBE85',
  nonVeg: '#F2635A',
  skeleton: '#242830',
  overlay: 'rgba(0,0,0,0.6)',
};
