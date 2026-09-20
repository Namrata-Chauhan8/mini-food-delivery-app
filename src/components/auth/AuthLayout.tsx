import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Screen } from '../common/Screen';
import { Text } from '../common/Text';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/** Shared chrome for the login and signup screens: heading, scrolling form, demo notice. */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const theme = useTheme();

  return (
    <Screen edges={[]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            padding: theme.layout.gutter,
            paddingBottom: theme.spacing.xxl,
            gap: theme.spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: theme.spacing.xs }}>
            <Text variant="h1">{title}</Text>
            <Text variant="small" color="textMuted" style={{ lineHeight: 20 }}>
              {subtitle}
            </Text>
          </View>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}


/** Form-level error shown above the submit button, for failures no single field owns. */
export function FormError({ message }: { message: string | undefined }) {
  const theme = useTheme();
  if (!message) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.danger,
        backgroundColor: theme.colors.primaryMuted,
      }}
    >
      <Ionicons name="alert-circle-outline" size={18} color={theme.colors.danger} />
      <Text variant="small" color="danger" style={{ flex: 1 }}>
        {message}
      </Text>
    </View>
  );
}
