import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { PaymentMethod } from '../../types';
import { Text } from '../common';

const OPTIONS: {
  id: PaymentMethod;
  label: string;
  caption: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'upi', label: 'UPI', caption: 'GPay, PhonePe, Paytm', icon: 'phone-portrait-outline' },
  { id: 'card', label: 'Credit / Debit Card', caption: 'Visa, Mastercard, RuPay', icon: 'card-outline' },
  { id: 'wallet', label: 'Wallet', caption: 'Paytm, Amazon Pay', icon: 'wallet-outline' },
  { id: 'cash', label: 'Cash on Delivery', caption: 'Pay when it arrives', icon: 'cash-outline' },
];

export function PaymentMethodPicker({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.label}. ${option.caption}`}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: theme.spacing.md,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.surface,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={selected ? theme.colors.primary : theme.colors.textMuted}
            />

            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong">{option.label}</Text>
              <Text variant="small" color="textMuted">
                {option.caption}
              </Text>
            </View>

            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selected ? theme.colors.primary : theme.colors.border}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
