import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PriceSummary } from '../src/components/cart/PriceSummary';
import { PaymentMethodPicker } from '../src/components/checkout/PaymentMethodPicker';
import { Button, EmptyState, Screen, Text } from '../src/components/common';
import { getRestaurantById } from '../src/data/restaurants';
import { useAuthStore } from '../src/store/authStore';
import { useCartStore } from '../src/store/cartStore';
import { useOrdersStore } from '../src/store/ordersStore';
import { useTheme } from '../src/theme/ThemeProvider';
import { PaymentMethod } from '../src/types';
import { formatCurrency, formatItemCount } from '../src/utils/format';
import { calculatePricing, countCartItems } from '../src/utils/pricing';
import { validateAddress, validateFullName, validatePhone } from '../src/utils/validation';
import { TextField } from '../src/components/common/TextField';

type FormErrors = Partial<Record<'fullName' | 'phone' | 'address', string>>;

function validate(fullName: string, phone: string, address: string): FormErrors {
  const errors: FormErrors = {};

  const fullNameError = validateFullName(fullName);
  const phoneError = validatePhone(phone);
  const addressError = validateAddress(address);

  if (fullNameError) errors.fullName = fullNameError;
  if (phoneError) errors.phone = phoneError;
  if (addressError) errors.address = addressError;

  return errors;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.md }}>
      <Text variant="h3">{title}</Text>
      {children}
    </View>
  );
}

export default function CheckoutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const clearCart = useCartStore((s) => s.clear);
  const placeOrder = useOrdersStore((s) => s.placeOrder);
  const user = useAuthStore((s) => s.getCurrentUser());

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const pricing = useMemo(() => calculatePricing(items), [items]);
  const itemCount = countCartItems(items);

  const handlePlaceOrder = useCallback(async () => {
    const nextErrors = validate(fullName, phone, address);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (!restaurantId || !restaurantName) return;

    setSubmitting(true);
    // Brief pause so the button's loading state is visible, as a real submit would be.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const order = placeOrder({
      restaurantId,
      restaurantName,
      restaurantImage: getRestaurantById(restaurantId)?.image ?? items[0]?.image ?? '',
      items,
      pricing,
      delivery: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        instructions: instructions.trim(),
        paymentMethod,
      },
    });

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    clearCart();
    setSubmitting(false);

    router.replace({ pathname: '/order/[id]', params: { id: order.id } });
  }, [
    fullName,
    phone,
    address,
    instructions,
    paymentMethod,
    restaurantId,
    restaurantName,
    items,
    pricing,
    placeOrder,
    clearCart,
    router,
  ]);

  if (items.length === 0) {
    return (
      <Screen edges={[]}>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <EmptyState
          icon="cart-outline"
          title="Nothing to check out"
          message="Your cart is empty. Add a few dishes before placing an order."
          actionLabel="Browse restaurants"
          onAction={() => router.replace('/')}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Checkout' }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <Section title="Delivery Address">
            <TextField
              label="Full name"
              required
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. John Doe"
              autoCapitalize="words"
              error={errors.fullName}
            />
            <TextField
              label="Phone number"
              required
              value={phone}
              onChangeText={setPhone}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phone}
            />
            <TextField
              label="Address"
              required
              value={address}
              onChangeText={setAddress}
              placeholder="Flat / building, street, area, city"
              multiline
              error={errors.address}
            />
          </Section>

          <Section title="Delivery Instructions">
            <TextField
              label="Anything the rider should know?"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Ring the bell twice, leave at the door"
              multiline
            />
          </Section>

          <Section title="Payment Method">
            <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
          </Section>

          <Section title="Order Summary">
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: theme.spacing.lg,
                gap: theme.spacing.sm,
              }}
            >
              <Text variant="bodyStrong">{restaurantName}</Text>
              <Text variant="small" color="textMuted">
                {formatItemCount(itemCount)}
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginVertical: theme.spacing.xs,
                }}
              />

              {items.map((item) => (
                <View
                  key={item.menuItemId}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.md }}
                >
                  <Text variant="small" color="textMuted" style={{ flex: 1 }} numberOfLines={1}>
                    {item.qty} × {item.name}
                  </Text>
                  <Text variant="small">{formatCurrency(item.price * item.qty)}</Text>
                </View>
              ))}
            </View>

            <PriceSummary pricing={pricing} />
          </Section>
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            paddingHorizontal: theme.layout.gutter,
            paddingTop: theme.spacing.md,
            paddingBottom: Math.max(insets.bottom, theme.spacing.md),
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          }}
        >
          <View>
            <Text variant="h3">{formatCurrency(pricing.total)}</Text>
            <Text variant="caption" color="textMuted">
              TOTAL
            </Text>
          </View>
          <Button
            label="Place Order"
            onPress={() => void handlePlaceOrder()}
            loading={submitting}
            size="lg"
            style={{ flex: 1 }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
