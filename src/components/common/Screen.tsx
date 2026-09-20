import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { OfflineBanner } from './OfflineBanner';

type ScreenProps = {
  children: ReactNode;
  edges?: readonly Edge[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, edges = ['top'], padded = false, style }: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <OfflineBanner />
      <View
        style={[
          { flex: 1 },
          padded && { paddingHorizontal: theme.layout.gutter },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
