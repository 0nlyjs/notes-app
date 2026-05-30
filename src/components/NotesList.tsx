import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  StyleProp,
  Switch,
  TextInput,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';

// Beautiful multi-color card palettes for Light and Dark modes
export const CARD_PALETTES = {
  light: {
    indigo: { border: '#C7D2FE', badgeBg: '#EEF2FF', text: '#4F46E5', accent: '#6366F1' },
    emerald: { border: '#A7F3D0', badgeBg: '#ECFDF5', text: '#059669', accent: '#10B981' },
    amber: { border: '#FDE68A', badgeBg: '#FFFBEB', text: '#D97706', accent: '#F59E0B' },
    rose: { border: '#FECACA', badgeBg: '#FFF5F5', text: '#DC2626', accent: '#F43F5E' },
    cyan: { border: '#A5F3FC', badgeBg: '#ECFEFF', text: '#0891B2', accent: '#06B6D4' },
    purple: { border: '#E9D5FF', badgeBg: '#F3E8FF', text: '#7E22CE', accent: '#8B5CF6' },
  },
  dark: {
    indigo: { border: 'rgba(99, 102, 241, 0.2)', badgeBg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', accent: '#818CF8' },
    emerald: { border: 'rgba(16, 185, 129, 0.2)', badgeBg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', accent: '#34D399' },
    amber: { border: 'rgba(245, 158, 11, 0.2)', badgeBg: 'rgba(245, 158, 11, 0.15)', text: '#FDE047', accent: '#FBBF24' },
    rose: { border: 'rgba(244, 63, 94, 0.2)', badgeBg: 'rgba(244, 63, 94, 0.15)', text: '#FCA5A5', accent: '#F87171' },
    cyan: { border: 'rgba(6, 182, 212, 0.2)', badgeBg: 'rgba(6, 182, 212, 0.15)', text: '#67E8F9', accent: '#22D3EE' },
    purple: { border: 'rgba(139, 92, 246, 0.2)', badgeBg: 'rgba(139, 92, 246, 0.15)', text: '#D8B4FE', accent: '#C084FC' },
  },
} as const;

export type ColorFamily = keyof typeof CARD_PALETTES.light;

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  colorFamily?: ColorFamily;
}

export const getCategoryName = (family: ColorFamily) => {
  switch (family) {
    case 'indigo': return 'Work';
    case 'emerald': return 'Ideas';
    case 'amber': return 'Personal';
    case 'rose': return 'Creative';
    case 'cyan': return 'Finance';
    case 'purple': return 'Important';
    default: return 'General';
  }
};

interface NotesListProps {
  notes: Note[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSelectNote: (note: Note) => void;
  onAddNote: () => void;
}

export default function NotesList({
  notes,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleTheme,
  onSelectNote,
  onAddNote,
}: NotesListProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const numColumns = width < 600 ? 1 : width < 900 ? 2 : 3;
  const cardGap = Spacing.three;
  const containerPadding = Spacing.four;
  
  const cardWidth = (width - containerPadding * 2 - cardGap * (numColumns - 1)) / numColumns;

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const activeColors = Colors[isDarkMode ? 'dark' : 'light'];
  const colorFamilies: ColorFamily[] = ['indigo', 'emerald', 'amber', 'rose', 'cyan', 'purple'];

  const renderItem = ({ item, index }: { item: Note; index: number }) => {
    const textSecondaryColor = isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary;
    
    // Resolve dynamic card color family
    const family = item.colorFamily || colorFamilies[index % colorFamilies.length];
    const palette = CARD_PALETTES[isDarkMode ? 'dark' : 'light'][family];

    // Using StyleSheet.compose to merge layout and dynamic themed color styles
    const cardStyle = StyleSheet.compose(styles.card, {
      width: cardWidth,
      backgroundColor: activeColors.backgroundElement,
      borderColor: palette.border,
      borderLeftWidth: 5,
      borderLeftColor: palette.accent,
    });

    const typedCardStyle = cardStyle as StyleProp<ViewStyle>;

    return (
      <Pressable
        onPress={() => onSelectNote(item)}
        style={({ pressed }) => [
          typedCardStyle,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}>
        <View style={styles.cardHeader}>
          <ThemedText style={[styles.cardTitle, { color: activeColors.text }]} numberOfLines={1}>
            {item.title || 'Untitled'}
          </ThemedText>
        </View>
        
        <ThemedText style={[styles.cardSnippet, { color: activeColors.text }]} numberOfLines={3}>
          {item.content || 'Empty note'}
        </ThemedText>
        
        <View style={styles.cardFooter}>
          <ThemedText style={[styles.cardDate, { color: textSecondaryColor }]}>
            {formatDate(item.updatedAt)}
          </ThemedText>
          <View style={[styles.badge, { backgroundColor: palette.badgeBg }]}>
            <ThemedText style={[styles.badgeText, { color: palette.text }]}>
              {getCategoryName(family)}
            </ThemedText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: activeColors.background }]}>
      
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.three) }]}>
        <View>
          <ThemedText type="subtitle" style={[styles.mainTitle, { color: activeColors.text }]}>
            Notes
          </ThemedText>
          <ThemedText type="small" style={{ color: activeColors.textSecondary, fontWeight: '600' }}>
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} available
          </ThemedText>
        </View>

        {/* Theme Switcher Toggle */}
        <View style={[styles.themeToggleContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
          <ThemedText type="smallBold" style={[styles.themeText, { color: activeColors.text }]}>
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </ThemedText>
          <Switch
            value={isDarkMode}
            onValueChange={onToggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#6366F1' }}
            thumbColor={isDarkMode ? '#818CF8' : '#F59E0B'}
            ios_backgroundColor="#CBD5E1"
          />
        </View>
      </View>

      {/* Search Input Section */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBarContainer,
            {
              backgroundColor: activeColors.backgroundElement,
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            placeholder="Search notes or categories..."
            placeholderTextColor={activeColors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
            style={[styles.searchInput, { color: activeColors.text }]}
          />
          {searchQuery ? (
            <Pressable onPress={() => onSearchChange('')}>
              <ThemedText style={styles.clearIcon}>✖</ThemedText>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Notes Grid List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: BottomTabInset + Spacing.six,
            paddingHorizontal: containerPadding,
          },
        ]}
        columnWrapperStyle={numColumns > 1 ? { gap: cardGap } : undefined}
        numColumns={numColumns}
        key={numColumns}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyEmoji}>📝</ThemedText>
            <ThemedText type="default" style={[styles.emptyTitle, { color: activeColors.text }]}>
              {searchQuery ? 'No matching notes' : 'No notes yet'}
            </ThemedText>
            <ThemedText type="small" style={[styles.emptySubtitle, { color: activeColors.textSecondary }]}>
              {searchQuery
                ? 'Try checking for typos or searching another keyword.'
                : 'Tap the button below to jot down your first note!'}
            </ThemedText>
          </View>
        }
      />

      {/* Floating Add Note Action Button */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + Spacing.four }]}>
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && { opacity: 0.9, transform: [{ scale: 0.95 }] },
          ]}
          onPress={onAddNote}>
          <ThemedText style={styles.fabIcon}>+</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  mainTitle: {
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  themeText: {
    fontSize: 12,
  },
  searchSection: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.two,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'normal',
    padding: 0,
  },
  clearIcon: {
    fontSize: 12,
    color: '#94A3B8',
    padding: Spacing.one,
  },
  listContent: {
    paddingTop: Spacing.one,
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.three,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  cardHeader: {
    marginBottom: Spacing.two,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cardSnippet: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: Spacing.three,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: Spacing.two,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    marginTop: Spacing.five,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.three,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  emptySubtitle: {
    textAlign: 'center',
    paddingHorizontal: Spacing.five,
  },
  fabContainer: {
    position: 'absolute',
    right: Spacing.four,
    elevation: 5,
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
  },
});
