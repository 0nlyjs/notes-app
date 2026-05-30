import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import NoteEditor from '@/components/NoteEditor';
import NotesList, { Note } from '@/components/NotesList';
import { ThemedView } from '@/components/themed-view';

// Premium high-quality sample notes to showcase the typography and visual layout
const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: '💡 Startup Ideas & Musings',
    content: '1. A collaborative local-first markdown editor with native peer-to-peer syncing using CRDTs.\n\n2. Micro-CRM designed specifically for freelance developers that integrates directly with GitHub issues, milestones, and pull requests.\n\n3. An automated gardening assistant that polls local weather API data and sends alerts when soil moisture falls below threshold.',
    updatedAt: '2026-05-30T10:00:00.000Z',
  },
  {
    id: '2',
    title: '🛒 Weekly Grocery List',
    content: '- Fresh organic baby spinach & mixed microgreens\n- Unsweetened almond milk & Greek yogurt\n- Whole grain sourdough bread from artisanal local bakery\n- Fresh blueberries, avocados, and heirloom tomatoes\n- Dark roast whole coffee beans (Ethiopian Yirgacheffe or Sumatran)',
    updatedAt: '2026-05-30T09:15:00.000Z',
  },
  {
    id: '3',
    title: '⚡ React Native Styling Guidelines',
    content: 'Keep layout elements decoupled from presentation components. Always use StyleSheet.create for memory efficiency and performance optimization.\n\nMake sure to implement useWindowDimensions() when designing listings to support responsive views on web and tablet interfaces smoothly.\n\nAlways leverage StyleSheet.compose or StyleSheet.flatten for merging conditional styles cleanly without inline bloating.',
    updatedAt: '2026-05-29T18:40:00.000Z',
  },
  {
    id: '4',
    title: '📅 Meeting Notes - Project Alpha Sprint',
    content: 'Attendees: Sarah, David, Alex\n\nDiscussion Points:\n- Reviewed the initial high-fidelity interactive mockups. The responsive typography and view layouts feel extremely premium.\n- David suggested using a persistent SQL-based SQLite database for full production, but transient React state is perfect for our UI/UX layout verification.\n- Action Item: Sarah to review automated integration testing suite next Tuesday.',
    updatedAt: '2026-05-29T14:30:00.000Z',
  },
];

export default function HomeScreen() {
  const systemScheme = useColorScheme();
  
  // State management
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'list' | 'editor'>('list');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  // Theme override state (defaults to system scheme via useColorScheme())
  const [themeOverride, setThemeOverride] = useState<'light' | 'dark' | null>(null);

  // Active theme calculation
  const isDarkMode = themeOverride !== null 
    ? themeOverride === 'dark' 
    : systemScheme === 'dark';

  const handleToggleTheme = () => {
    setThemeOverride((prev) => (prev === 'dark' || (prev === null && systemScheme === 'dark') ? 'light' : 'dark'));
  };

  // Switch to Note Editor (View 2) for an existing note
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setCurrentScreen('editor');
  };

  // Switch to Note Editor (View 2) to create a new note
  const handleAddNote = () => {
    setSelectedNote(null);
    setCurrentScreen('editor');
  };

  // Save/Update note and return to Notes Listing (View 1)
  const handleSaveNote = (title: string, content: string) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      // Don't save empty notes, just go back
      setCurrentScreen('list');
      setSelectedNote(null);
      return;
    }

    if (selectedNote) {
      // Edit existing note
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                title: trimmedTitle || 'Untitled Note',
                content: trimmedContent,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: trimmedTitle || 'Untitled Note',
        content: trimmedContent,
        updatedAt: new Date().toISOString(),
      };
      setNotes((prevNotes) => [newNote, ...prevNotes]);
    }

    setCurrentScreen('list');
    setSelectedNote(null);
  };

  const handleBack = () => {
    setCurrentScreen('list');
    setSelectedNote(null);
  };

  return (
    <SafeAreaProvider>
      <ThemedView style={{ flex: 1, backgroundColor: isDarkMode ? '#000000' : '#ffffff' }}>
        {currentScreen === 'list' ? (
          <NotesList
            notes={notes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            onSelectNote={handleSelectNote}
            onAddNote={handleAddNote}
          />
        ) : (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onBack={handleBack}
            isDarkMode={isDarkMode}
          />
        )}
      </ThemedView>
    </SafeAreaProvider>
  );
}
