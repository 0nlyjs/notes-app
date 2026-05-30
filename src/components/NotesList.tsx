import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

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

  // Dynamic grid setup
  const numColumns = width < 600 ? 1 : width < 900 ? 2 : 3;
  const cardGap = Spacing.two;
  const containerPadding = Spacing.three;
  
  // Calculate width per column
  const cardWidth = (width - containerPadding * 2 - cardGap * (numColumns - 1)) / numColumns;

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formats full date/time nicely
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const activeColors = Colors[isDarkMode ? 'dark' : 'light'];

  const renderItem = ({ item }: { item: Note }) => {
    const textSecondaryColor = isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary;
    
    // Using StyleSheet.compose as required by the styling rules
    const cardStyle = StyleSheet.compose(styles.card, {
      width: cardWidth,
      backgroundColor: activeColors.backgroundElement,
      borderColor: isDarkMode ? '#2D3139' : '#E4E5EB',
    });

    return (
      <Pressable
        onPress={() => onSelectNote(item)}
        style={({ pressed }) => [
          cardStyle,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        ]}>
        <View style={styles.cardHeader}>
          <ThemedText style={styles.cardTitle} numberOfLines={1}>
            {item.title || 'Untitled'}
          </ThemedText>
        </View>
        <ThemedText style={styles.cardSnippet} numberOfLines={3}>
          {item.content || 'Empty note'}
        </ThemedText>
        <ThemedText style={[styles.cardDate, { color: textSecondaryColor }]}>
          {formatDate(item.updatedAt)}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, Spacing.three) }]}>
        <View>
          <ThemedText type="subtitle" style={styles.mainTitle}>
            Notes
          </ThemedText>
          <ThemedText type="small" style={{ color: activeColors.textSecondary }}>
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} available
          </ThemedText>
        </View>

        {/* Theme Switcher Toggle */}
        <View style={styles.themeToggleContainer}>
          <ThemedText type="smallBold" style={styles.themeText}>
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </ThemedText>
          <Switch
            value={isDarkMode}
            onValueChange={onToggleTheme}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={isDarkMode ? '#312E81' : '#FBBF24'}
            ios_backgroundColor="#D1D5DB"
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
              borderColor: isDarkMode ? '#2D3139' : '#E4E5EB',
            },
          ]}>
          <ThemedText style={styles.searchIcon}>🔍</ThemedText>
          <TextInput
            placeholder="Search notes..."
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
        key={numColumns} // Forces complete redraw when grid sizing layout changes
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyEmoji}>📝</ThemedText>
            <ThemedText type="default" style={styles.emptyTitle}>
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
    paddingBottom: Spacing.two,
  },
  mainTitle: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
  },
  themeText: {
    fontSize: 12,
  },
  searchSection: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
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
    color: '#888',
    padding: Spacing.one,
  },
  listContent: {
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 1,
    marginBottom: Spacing.two,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: Spacing.one,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardSnippet: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.8,
    marginBottom: Spacing.two,
  },
  cardDate: {
    fontSize: 11,
    fontWeight: '600',
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
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
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
