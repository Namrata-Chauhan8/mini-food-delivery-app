import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { ColorScheme, darkColors, lightColors } from './colors';
import { columnsForWidth, gutterForWidth, radius, spacing } from './spacing';
import { typography } from './typography';

export type Theme = {
  dark: boolean;
  colors: ColorScheme;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  layout: {
    width: number;
    height: number;
    columns: number;
    gutter: number;
    isTablet: boolean;
    isLandscape: boolean;
  };
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const { width, height } = useWindowDimensions();

  const dark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const theme = useMemo<Theme>(() => {
    const columns = columnsForWidth(width);
    return {
      dark,
      colors: dark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      layout: {
        width,
        height,
        columns,
        gutter: gutterForWidth(width),
        isTablet: columns > 1,
        isLandscape: width > height,
      },
    };
  }, [dark, width, height]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}
