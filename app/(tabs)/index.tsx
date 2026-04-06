import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, Dimensions, Platform } from 'react-native';
import { View, Text, SafeAreaView } from '@/components';
import { useNoteStore } from '@/stores/note-store';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/theme-provider';
import { Sidebar } from '@/components/sidebar';
import { MarkdownView } from '@/lib/markdown';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width >= 768;

export default function HomeScreen() {
  const { notes, activeNoteId, getActiveNote, updateNote, setActiveNote } = useNoteStore();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('[HomeScreen] activeNoteId:', activeNoteId, 'notes count:', notes.length);

  // Derive activeNote directly instead of using getActiveNote action
  const activeNote = notes.find((n) => String(n.id) === String(activeNoteId));
  console.log('[HomeScreen] activeNote found:', activeNote?.title || 'None');

  const handleSave = async () => {
    if (activeNote) {
      await updateNote(activeNote.id, editContent);
      setIsEditing(false);
    }
  };

  const handleGoBack = () => {
    setActiveNote(null);
    setIsEditing(false);
  };

  const handleSelectNote = (id: string) => {
    setActiveNote(id);
    setIsEditing(false);
  };

  const handleWikilinkPress = (title: string) => {
    const linkedNote = notes.find(
      (n) => n.title.toLowerCase() === title.toLowerCase()
    );
    if (linkedNote) {
      setActiveNote(linkedNote.id);
    }
  };

  const MobileView = () => {
    if (!activeNote) {
      // Mobile: Full screen Note List
      return <Sidebar onNoteSelect={handleSelectNote} visible={true} />;
    }

    if (isEditing) {
      return (
        <View className="flex-1 bg-background" style={{ paddingTop: 40 }}>
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <Pressable onPress={() => setIsEditing(false)} className="flex-row items-center gap-2">
              <Ionicons name="chevron-back" size={24} color={isDark ? '#fafafa' : '#09090b'} />
              <Text variant="bold">Back</Text>
            </Pressable>
            <Text variant="bold" className="text-primary">Editing</Text>
            <Pressable onPress={handleSave} className="flex-row items-center gap-2">
              <Ionicons name="checkmark" size={24} color={isDark ? '#38bdf8' : '#0ea5e9'} />
              <Text className="text-primary font-bold">Save</Text>
            </Pressable>
          </View>
          <TextInput
            value={editContent}
            onChangeText={setEditContent}
            multiline
            className="flex-1 p-4 text-foreground text-base"
            placeholder="Start writing..."
            placeholderTextColor={isDark ? '#4b5563' : '#94a3b8'}
            style={{ textAlignVertical: 'top' }}
          />
        </View>
      );
    }

    // Mobile: Full screen Viewing View
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: 40 }}>
        <View className="flex-row items-center justify-between p-4 border-b border-border">
          <View className="flex-row items-center flex-1">
            <Pressable onPress={handleGoBack} className="w-10 h-10 rounded-xl items-center justify-center mr-2">
              <Ionicons name="chevron-back" size={24} color={isDark ? '#fafafa' : '#09090b'} />
            </Pressable>
            <Text variant="title" numberOfLines={1} className="flex-1">{activeNote.title}</Text>
          </View>
          <Pressable
            onPress={() => { setEditContent(activeNote.content); setIsEditing(true); }}
            className="ml-2 w-10 h-10 rounded-xl bg-primary items-center justify-center"
          >
            <Ionicons name="create" size={20} color={isDark ? '#09090b' : '#f8fafc'} />
          </Pressable>
        </View>
        <ScrollView className="flex-1 p-4">
          <MarkdownView content={activeNote.content} onWikilinkPress={handleWikilinkPress} />
        </ScrollView>
        <View className="p-4 border-t border-border">
          <Text variant="caption">
            Last updated: {new Date(activeNote.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  const WebView = () => {
    return (
      <View className="flex-1 flex-row">
        <Sidebar onNoteSelect={handleSelectNote} visible={true} />
        <View className="flex-1 bg-background">
          {!activeNote ? (
            <View className="flex-1 items-center justify-center p-8">
              <Ionicons name="document-text-outline" size={64} color={isDark ? '#4b5563' : '#94a3b8'} />
              <Text variant="title" className="mt-4 mb-2">Select a Note</Text>
              <Text variant="caption" className="text-center">
                Choose a note from the sidebar or create a new one.
              </Text>
            </View>
          ) : isEditing ? (
            <View className="flex-1">
              <View className="flex-row items-center justify-between p-4 border-b border-border">
                <Pressable onPress={() => setIsEditing(false)} className="flex-row items-center gap-2">
                  <Ionicons name="close" size={24} color={isDark ? '#fafafa' : '#09090b'} />
                  <Text variant="bold">Cancel</Text>
                </Pressable>
                <Text variant="bold" className="text-primary">Editing</Text>
                <Pressable onPress={handleSave} className="flex-row items-center gap-2">
                  <Ionicons name="checkmark" size={24} color={isDark ? '#38bdf8' : '#0ea5e9'} />
                  <Text className="text-primary font-bold">Save</Text>
                </Pressable>
              </View>
              <TextInput
                value={editContent}
                onChangeText={setEditContent}
                multiline
                className="flex-1 p-4 text-foreground text-base"
                placeholder="Start writing..."
                placeholderTextColor={isDark ? '#4b5563' : '#94a3b8'}
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          ) : (
            <View className="flex-1">
              <View className="flex-row items-center justify-between p-4 border-b border-border">
                <Text variant="title" numberOfLines={1} className="flex-1">{activeNote.title}</Text>
                <Pressable
                  onPress={() => { setEditContent(activeNote.content); setIsEditing(true); }}
                  className="ml-2 w-10 h-10 rounded-xl bg-primary items-center justify-center"
                >
                  <Ionicons name="create" size={20} color={isDark ? '#09090b' : '#f8fafc'} />
                </Pressable>
              </View>
              <ScrollView className="flex-1 p-4">
                <MarkdownView content={activeNote.content} onWikilinkPress={handleWikilinkPress} />
              </ScrollView>
              <View className="p-4 border-t border-border">
                <Text variant="caption">
                  Last updated: {new Date(activeNote.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return isWeb ? <WebView /> : <MobileView />;
}
