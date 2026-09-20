import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Props = {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  label?: string;
};

export function QuantityStepper({ qty, onIncrement, onDecrement, size = 'md', label }: Props) {
  const theme = useTheme();
  const dimension = size === 'sm' ? 30 : 36;
  const iconSize = size === 'sm' ? 15 : 18;

  const press = (action: () => void) => () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

  const StepButton = ({
    icon,
    onPress,
    hint,
  }: {
    icon: 'remove' | 'add';
    onPress: () => void;
    hint: string;
  }) => (
    <Pressable
      onPress={press(onPress)}
      accessibilityRole="button"
      accessibilityLabel={hint}
      hitSlop={6}
      style={({ pressed }) => ({
        width: dimension,
        height: dimension,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Ionicons name={icon} size={iconSize} color={theme.colors.primary} />
    </Pressable>
  );

  return (
    <View
      accessibilityLabel={label ? `${label}, quantity ${qty}` : undefined}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.primaryMuted,
        overflow: 'hidden',
      }}
    >
      <StepButton icon="remove" onPress={onDecrement} hint="Decrease quantity" />
      <Text variant="bodyStrong" color="primary" style={{ minWidth: 20, textAlign: 'center' }}>
        {qty}
      </Text>
      <StepButton icon="add" onPress={onIncrement} hint="Increase quantity" />
    </View>
  );
}
