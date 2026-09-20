import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { AuthLayout, FormError } from '../../src/components/auth/AuthLayout';
import { Button, Text } from '../../src/components/common';
import { toAuthRedirect, useAuthRedirect } from '../../src/hooks/useAuthRedirect';
import { useAuthStore } from '../../src/store/authStore';
import { useTheme } from '../../src/theme/ThemeProvider';
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
} from '../../src/utils/validation';
import { TextField } from '../../src/components/common/TextField';

type Field = 'fullName' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'form';
type FormErrors = Partial<Record<Field, string>>;

export default function SignupScreen() {
  const theme = useTheme();
  const router = useRouter();

  const params = useLocalSearchParams<{ redirect?: string }>();
  const redirect = toAuthRedirect(params.redirect);
  useAuthRedirect(redirect);

  const signUp = useAuthStore((s) => s.signUp);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const nextErrors: FormErrors = {};
    const checks: [Field, string | null][] = [
      ['fullName', validateFullName(fullName)],
      ['email', validateEmail(email)],
      ['phone', validatePhone(phone)],
      ['password', validatePassword(password)],
      ['confirmPassword', validatePasswordConfirmation(password, confirmPassword)],
    ];

    for (const [field, message] of checks) {
      if (message) nextErrors[field] = message;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = signUp({ fullName, email, phone, password });

    if (!result.ok) {
      setSubmitting(false);
      setErrors({ [result.field]: result.message });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // signUp() also signs the new account in, so useAuthRedirect takes it from here.
  }, [fullName, email, phone, password, confirmPassword, signUp]);

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        redirect === 'checkout'
          ? 'One quick step, then you can place your order.'
          : 'Save your details so checkout stays quick.'
      }
    >
      <View style={{ gap: theme.spacing.md }}>
        <TextField
          label="Full name"
          required
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. John Doe"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          error={errors.fullName}
        />
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
          label="Phone number"
          required
          value={phone}
          onChangeText={setPhone}
          placeholder="10-digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          autoComplete="tel"
          textContentType="telephoneNumber"
          error={errors.phone}
        />
        <TextField
          label="Password"
          required
          value={password}
          onChangeText={setPassword}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          error={errors.password}
        />
        <TextField
          label="Confirm password"
          required
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Type it once more"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={() => void handleSubmit()}
          error={errors.confirmPassword}
        />
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <FormError message={errors.form} />

        <Button
          label="Create account"
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
            Already have an account?
          </Text>
          <Button
            label="Log in"
            variant="ghost"
            size="sm"
            onPress={() =>
              router.replace({ pathname: '/login', params: redirect ? { redirect } : {} })
            }
          />
        </View>
      </View>
    </AuthLayout>
  );
}
