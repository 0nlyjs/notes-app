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
import { Colors, Spacing } from '@/constants/theme';

import { CARD_PALETTES, ColorFamily, getCategoryName, Note } from './NotesList';

interface NoteEditorProps {
  note: Note | null;
  onSave: (title: string, content: string, colorFamily: ColorFamily) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function NoteEditor({ note, onSave, onBack, isDarkMode }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorFamily, setColorFamily] = useState<ColorFamily>('indigo');
  
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Load note values on focus
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColorFamily(note.colorFamily || 'indigo');
    } else {
      setTitle('');
      setContent('');
      setColorFamily('indigo');
    }
  }, [note]);

  const activeColors = Colors[isDarkMode ? 'dark' : 'light'];
  
  // Dynamic palette highlighting based on active bubble choice
  const activePalette = CARD_PALETTES[isDarkMode ? 'dark' : 'light'][colorFamily];

  const handleSave = () => {
    onSave(title, content, colorFamily);
  };

  const isTablet = width >= 600;
  const editorMaxWidth = 800;
  const marginHorizontal = isTablet ? (width - editorMaxWidth) / 2 : 0;
  const headerHeight = isTablet ? 185 : 145;

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
      borderColor: activePalette.accent, // Dynamic accent border color matches chosen category color!
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

            <View style={styles.titleWrapper}>
              <ThemedText style={styles.headerTitle}>
                {note ? 'Edit Note' : 'New Note'}
              </ThemedText>
              <View style={[styles.miniBadge, { backgroundColor: activePalette.badgeBg }]}>
                <ThemedText style={[styles.miniBadgeText, { color: activePalette.text }]}>
                  {getCategoryName(colorFamily)}
                </ThemedText>
              </View>
            </View>

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
          
          {/* Category/Color Selector Row */}
          <View style={styles.colorSelectorContainer}>
            <ThemedText style={[styles.selectorLabel, { color: activeColors.textSecondary }]}>
              Category:
            </ThemedText>
            <View style={styles.colorBubblesRow}>
              {(['indigo', 'emerald', 'amber', 'rose', 'cyan', 'purple'] as ColorFamily[]).map((family) => {
                const palette = CARD_PALETTES[isDarkMode ? 'dark' : 'light'][family];
                const isSelected = colorFamily === family;
                
                return (
                  <Pressable
                    key={family}
                    onPress={() => setColorFamily(family)}
                    style={({ pressed }) => [
                      styles.colorBubble,
                      {
                        backgroundColor: palette.accent,
                        borderColor: isDarkMode ? '#F8FAFC' : '#0F172A',
                        borderWidth: isSelected ? 2.5 : 0,
                      },
                      pressed && { opacity: 0.7, transform: [{ scale: 0.9 }] },
                    ]}>
                    {isSelected && (
                      <ThemedText style={styles.bubbleCheck}>✓</ThemedText>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
          
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
                minHeight: height - headerHeight - 190,
              },
            ]}
            multiline
            textAlignVertical="top"
            scrollEnabled={false} // Managed by ScrollView container
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
    backgroundColor: 'rgba(15, 12, 30, 0.45)', // Tinted glass overlay
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.5,
  },
  miniBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontWeight: '700',
  },
  editorContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    flexGrow: 1,
  },
  colorSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorBubblesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  colorBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '800',
    paddingVertical: Spacing.two,
    marginBottom: Spacing.four,
    borderBottomWidth: 2.5,
    fontFamily: 'normal',
    letterSpacing: -0.5,
  },
  contentInput: {
    flex: 1,
    paddingVertical: Spacing.two,
    textAlignVertical: 'top',
    fontFamily: 'normal',
  },
});
