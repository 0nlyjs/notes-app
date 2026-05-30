import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

import { Note } from './NotesList';

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function NoteEditor({ note, onSave, onBack, isDarkMode }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Load note values on focus
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const activeColors = Colors[isDarkMode ? 'dark' : 'light'];

  const handleSave = () => {
    onSave(title, content);
  };

  // Responsive design calculations
  const isTablet = width >= 600;
  const editorMaxWidth = 800;
  const marginHorizontal = isTablet ? (width - editorMaxWidth) / 2 : 0;
  
  // Dynamic header heights based on layout
  const headerHeight = isTablet ? 180 : 140;

  // Flatten styles as requested by the styling rules (using StyleSheet.flatten)
  const editorContainerStyle = StyleSheet.flatten([
    styles.editorContainer,
    {
      backgroundColor: activeColors.background,
      marginHorizontal: marginHorizontal,
      flex: 1,
    },
  ]);

  const titleInputStyle = StyleSheet.flatten([
    styles.titleInput,
    {
      color: activeColors.text,
      borderColor: isDarkMode ? '#2D3139' : '#E4E5EB',
    },
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: activeColors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      
      {/* Header section with abstract ImageBackground */}
      <ImageBackground
        source={require('@/assets/images/header_bg.png')}
        style={[styles.headerBackground, { height: headerHeight }]}
        resizeMode="cover">
        
        {/* Semi-transparent blur overlay */}
        <View style={[styles.headerOverlay, { paddingTop: Math.max(insets.top, Spacing.three) }]}>
          <View style={[styles.headerBar, isTablet && { maxWidth: editorMaxWidth, width: '100%', alignSelf: 'center' }]}>
            
            {/* Back Button */}
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.glassButton,
                pressed && styles.glassButtonPressed,
              ]}>
              <ThemedText style={styles.glassButtonText}>⬅</ThemedText>
            </Pressable>

            <ThemedText style={styles.headerTitle}>
              {note ? 'Edit Note' : 'New Note'}
            </ThemedText>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.glassButton,
                styles.saveButton,
                pressed && styles.glassButtonPressed,
              ]}>
              <ThemedText style={[styles.glassButtonText, styles.saveButtonText]}>Save</ThemedText>
            </Pressable>

          </View>
        </View>
      </ImageBackground>

      {/* Editor Content Area */}
      <View style={editorContainerStyle}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: isTablet ? Spacing.five : Spacing.four,
            },
          ]}
          keyboardShouldPersistTaps="handled">
          
          {/* Note Title Input */}
          <TextInput
            placeholder="Title"
            placeholderTextColor={activeColors.textSecondary}
            value={title}
            onChangeText={setTitle}
            style={titleInputStyle}
            maxLength={80}
            returnKeyType="next"
          />

          {/* Note Body Input */}
          <TextInput
            placeholder="Start writing something beautiful..."
            placeholderTextColor={activeColors.textSecondary}
            value={content}
            onChangeText={setContent}
            style={[
              styles.contentInput,
              {
                color: activeColors.text,
                fontSize: isTablet ? 18 : 16,
                lineHeight: isTablet ? 26 : 22,
                minHeight: height - headerHeight - 150, // Ensures input takes up bulk of screen
              },
            ]}
            multiline
            textAlignVertical="top"
            scrollEnabled={false} // Handled by outer ScrollView
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    width: '100%',
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 12, 30, 0.45)', // Premium dark tint overlay
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  glassButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 0.95 }],
  },
  glassButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.85)',
    borderColor: 'rgba(129, 140, 248, 0.4)',
  },
  saveButtonText: {
    fontSize: 15,
  },
  editorContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    flexGrow: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
    fontFamily: 'normal',
  },
  contentInput: {
    flex: 1,
    paddingVertical: Spacing.two,
    textAlignVertical: 'top',
    fontFamily: 'normal',
  },
});
