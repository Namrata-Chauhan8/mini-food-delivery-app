import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { CATEGORIES } from '../../data/categories';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../common';

type Props = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

function CategoryChipsBase({ selectedId, onSelect }: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // ScrollView defaults to flexGrow: 1, which would make this row stretch
      // down and split the leftover height with the restaurant list below it.
      style={{ flexGrow: 0 }}
      contentContainerStyle={{
        gap: theme.spacing.sm,
        paddingHorizontal: theme.layout.gutter,
        paddingVertical: theme.spacing.sm,
      }}
    >
      {CATEGORIES.map((category) => {
        const selected = selectedId === category.id;
        return (
          <Pressable
            key={category.id}
            // Tapping the active chip clears the filter.
            onPress={() => onSelect(selected ? null : category.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${category.name} category`}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: theme.spacing.md,
              height: 38,
              borderRadius: theme.radius.pill,
              borderWidth: 1,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.surface,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons
              name={category.icon as keyof typeof Ionicons.glyphMap}
              size={15}
              color={selected ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text variant="smallStrong" color={selected ? 'primary' : 'textMuted'}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
      <View style={{ width: theme.spacing.xs }} />
    </ScrollView>
  );
}

export const CategoryChips = memo(CategoryChipsBase);
