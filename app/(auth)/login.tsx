import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { AuthLayout, FormError } from '../../src/components/auth/AuthLayout';
import { Button, Text } from '../../src/components/common';
import { toAuthRedirect, useAuthRedirect } from '../../src/hooks/useAuthRedirect';
import { useAuthStore } from '../../src/store/authStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import { validateEmail } from '../../src/utils/validation';
import { TextField } from '../../src/components/common/TextField';

type FormErrors = Partial<Record<'email' | 'password' | 'form', string>>;

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();

  const params = useLocalSearchParams<{ redirect?: string }>();
  const redirect = toAuthRedirect(params.redirect);
  useAuthRedirect(redirect);

  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const nextErrors: FormErrors = {};
    const emailError = validateEmail(email);

    if (emailError) nextErrors.email = emailError;
    if (password.length === 0) nextErrors.password = 'Please enter your password.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setSubmitting(true);
    // Brief pause so the button's loading state is visible, as a real sign-in would be.
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = signIn(email, password);

    if (!result.ok) {
      setSubmitting(false);
      setErrors({ [result.field]: result.message });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Stays in its loading state until useAuthRedirect navigates away.
  }, [email, password, signIn]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        redirect === 'checkout'
          ? 'Log in to place your order. Your cart is waiting.'
          : 'Log in to pick up where you left off.'
      }
    >
      <View style={{ gap: theme.spacing.md }}>
        <TextField
          label="Email"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          error={errors.email}
        />
        <TextField
          label="Password"
          required
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={() => void handleSubmit()}
          error={errors.password}
        />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <FormError message={errors.form} />

        <Button
          label="Log in"
          onPress={() => void handleSubmit()}
          size="lg"
          fullWidth
          loading={submitting}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.xs,
          }}
        >
          <Text variant="small" color="textMuted">
            New here?
          </Text>
          <Button
            label="Create an account"
            variant="ghost"
            size="sm"
            onPress={() =>
              router.replace({ pathname: '/signup', params: redirect ? { redirect } : {} })
            }
          />
        </View>
      </View>
    </AuthLayout>
  );
}
