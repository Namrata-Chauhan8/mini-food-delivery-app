import { TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  required?: boolean;
};

export function TextField({ label, error, required = false, style, ...rest }: Props) {
  const theme = useTheme();
  const hasError = Boolean(error);

  return (
    <View style={{ gap: 6 }}>
      <Text variant="smallStrong" color="textMuted">
        {label}
        {required ? ' *' : ''}
      </Text>

      <TextInput
        {...rest}
        placeholderTextColor={theme.colors.textMuted}
        accessibilityLabel={label}
        style={[
          {
            borderWidth: 1,
            borderColor: hasError ? theme.colors.danger : theme.colors.border,
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            color: theme.colors.text,
            ...theme.typography.body,
          },
          rest.multiline && { minHeight: 88, textAlignVertical: 'top' },
          style,
        ]}
      />

      {hasError ? (
        <Text variant="small" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
