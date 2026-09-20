import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import {
  Button,
  Card,
  CartButton,
  Screen,
  Text,
  ThemeToggle,
} from '../../src/components/common';
import { useSignOut } from '../../src/hooks/useSignOut';
import { useAuthStore } from '../../src/store/authStore';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useOrdersStore } from '../../src/store/ordersStore';
import { useTheme } from '../../src/theme/ThemeProvider';

function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  const user = useAuthStore((s) => s.getCurrentUser());
  const signOut = useSignOut();
  const orderCount = useOrdersStore((s) => s.orders.length);
  const favoriteCount = useFavoritesStore((s) => s.ids.length);

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          paddingHorizontal: theme.layout.gutter,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.md,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="h2">Profile</Text>
          <Text variant="small" color="textMuted">
            {user ? user.email : 'Not signed in'}
          </Text>
        </View>
        <ThemeToggle />
        <CartButton />
      </View>

      {user ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.layout.gutter,
            paddingBottom: theme.spacing.xxl,
            gap: theme.spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.primaryMuted,
                }}
              >
                <Text variant="h3" color="primary">
                  {initialsOf(user.fullName)}
                </Text>
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="h3" numberOfLines={1}>
                  {user.fullName}
                </Text>
                <Text variant="small" color="textMuted" numberOfLines={1}>
                  {user.email}
                </Text>
                <Text variant="small" color="textMuted">
                  +91 {user.phone}
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <StatCard
              icon="receipt-outline"
              value={orderCount}
              label={orderCount === 1 ? 'Order' : 'Orders'}
              onPress={() => router.push('/orders')}
            />
            <StatCard
              icon="heart-outline"
              value={favoriteCount}
              label={favoriteCount === 1 ? 'Favorite' : 'Favorites'}
              onPress={() => router.push('/favorites')}
            />
          </View>

          <Card>
            <View style={{ gap: theme.spacing.sm }}>
              <Text variant="smallStrong">Delivery details</Text>
              <Text variant="small" color="textMuted" style={{ lineHeight: 19 }}>
                Your name and phone number are filled in for you at checkout. The delivery
                address is asked for with each order, since it changes more often.
              </Text>
            </View>
          </Card>

          <Button label="Sign out" onPress={signOut} variant="danger" size="lg" fullWidth />
        </ScrollView>
      ) : (
        <SignedOutState />
      )}
    </Screen>
  );
}

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  onPress: () => void;
};

function StatCard({ icon, value, label, onPress }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card onPress={onPress} accessibilityLabel={`${value} ${label}`} style={{ flex: 1 }}>
      <View style={{ gap: theme.spacing.xs }}>
        <Ionicons name={icon} size={20} color={theme.colors.textMuted} />
        <Text variant="h2">{value}</Text>
        <Text variant="caption" color="textMuted">
          {label.toUpperCase()}
        </Text>
      </View>
    </Card>
  );
}

/** Guests can use the whole app except checkout, so this is an invitation, not a wall. */
function SignedOutState() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
        gap: theme.spacing.md,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surfaceAlt,
        }}
      >
        <Ionicons name="person-outline" size={32} color={theme.colors.textMuted} />
      </View>

      <Text variant="h3" style={{ textAlign: 'center' }}>
        You&apos;re browsing as a guest
      </Text>
      <Text variant="small" color="textMuted" style={{ textAlign: 'center', lineHeight: 20 }}>
        Keep looking around as long as you like. An account is only needed to place an order —
        and it keeps your name and phone number ready at checkout.
      </Text>

      <View style={{ alignSelf: 'stretch', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
        <Button label="Log in" onPress={() => router.push('/login')} size="lg" fullWidth />
        <Button
          label="Create an account"
          onPress={() => router.push('/signup')}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}
