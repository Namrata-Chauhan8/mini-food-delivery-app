import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { PriceBreakdown } from '../../types';
import { formatCurrency } from '../../utils/format';
import { amountToFreeDelivery, PRICING_CONFIG } from '../../utils/pricing';
import { Text } from '../common';

function Row({
  label,
  value,
  strong = false,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: 'success';
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
      }}
    >
      <Text variant={strong ? 'bodyStrong' : 'body'} color={strong ? 'text' : 'textMuted'}>
        {label}
      </Text>
      <Text
        variant={strong ? 'bodyStrong' : 'body'}
        color={accent === 'success' ? 'success' : 'text'}
        style={accent === 'success' ? undefined : { color: theme.colors.text }}
      >
        {value}
      </Text>
    </View>
  );
}

export function PriceSummary({ pricing }: { pricing: PriceBreakdown }) {
  const theme = useTheme();
  const remaining = amountToFreeDelivery(pricing.subtotal);
  const freeDelivery = pricing.subtotal > 0 && pricing.deliveryFee === 0;

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.lg,
      }}
    >
      <Text variant="h3" style={{ marginBottom: theme.spacing.sm }}>
        Bill Details
      </Text>

      <Row label="Item total" value={formatCurrency(pricing.subtotal)} />
      <Row
        label="Delivery fee"
        value={freeDelivery ? 'FREE' : formatCurrency(pricing.deliveryFee)}
        accent={freeDelivery ? 'success' : undefined}
      />
      <Row
        label={`Taxes (${Math.round(PRICING_CONFIG.taxRate * 100)}% GST)`}
        value={formatCurrency(pricing.tax)}
      />

      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.border,
          marginVertical: theme.spacing.sm,
        }}
      />

      <Row label="To pay" value={formatCurrency(pricing.total)} strong />

      {remaining > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: theme.spacing.md,
            padding: theme.spacing.sm,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.colors.primaryMuted,
          }}
        >
          <Ionicons name="bicycle-outline" size={15} color={theme.colors.primary} />
          <Text variant="small" color="primary" style={{ flex: 1 }}>
            Add {formatCurrency(remaining)} more for free delivery
          </Text>
        </View>
      ) : null}
    </View>
  );
}
