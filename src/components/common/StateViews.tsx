import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from './Button';
import { Text } from './Text';

type StateViewProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'danger';
};

function StateView({ icon, title, message, actionLabel, onAction, tone = 'neutral' }: StateViewProps) {
  const theme = useTheme();
  const accent = tone === 'danger' ? theme.colors.danger : theme.colors.textMuted;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xxl,
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
          backgroundColor: tone === 'danger' ? theme.colors.primaryMuted : theme.colors.surfaceAlt,
        }}
      >
        <Ionicons name={icon} size={32} color={accent} />
      </View>
      <Text variant="h3" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      <Text variant="small" color="textMuted" style={{ textAlign: 'center', lineHeight: 20 }}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" size="md" />
      ) : null}
    </View>
  );
}

export function EmptyState(props: Omit<StateViewProps, 'tone'>) {
  return <StateView {...props} tone="neutral" />;
}

export function ErrorState({
  message,
  onRetry,
  title = 'Something went wrong',
}: {
  message: string;
  onRetry?: () => void;
  title?: string;
}) {
  return (
    <StateView
      icon="cloud-offline-outline"
      title={title}
      message={message}
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
      tone="danger"
    />
  );
}

export function Loader({ label }: { label?: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {label ? (
        <Text variant="small" color="textMuted">
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/** Inline spinner for "loading more" at the bottom of a paginated list. */
export function FooterLoader({ visible }: { visible: boolean }) {
  const theme = useTheme();
  if (!visible) return null;
  return (
    <View style={{ paddingVertical: theme.spacing.lg, alignItems: 'center' }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );
}
