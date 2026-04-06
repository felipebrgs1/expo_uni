import React, { useState } from 'react';
import { Pressable, Modal, TextInput, ScrollView, Dimensions, Platform } from 'react-native';
import { View, Text } from '@/components';
import { useNoteStore } from '@/stores/note-store';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/theme-provider';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width >= 768;

interface SidebarProps {
  onNoteSelect?: (id: string) => void;
  onNewNote?: () => void;
  visible?: boolean;
  onClose?: () => void;
}

export function Sidebar({ onNoteSelect, onNewNote, visible = true, onClose }: SidebarProps) {
  const { getFilteredNotes, setActiveNote, searchQuery, setSearchQuery, addNote } = useNoteStore();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const filteredNotes = getFilteredNotes();

  const handleCreateNote = async () => {
    if (newTitle.trim()) {
      await addNote(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
      onNewNote?.();
    }
  };

  const handleSelectNote = (id: string) => {
    setActiveNote(id);
    onNoteSelect?.(id);
    if (!isWeb) {
      onClose?.();
    }
  };

  const content = (
    <View className="flex-1 bg-background">
      <View className="p-4 border-b border-border">
        <View className="flex-row items-center justify-between mb-4">
          <Text variant="title" className="text-primary">Notes</Text>
          <View className="flex-row gap-2">
            {!isWeb && onClose && (
              <Pressable onPress={onClose} className="w-10 h-10 rounded-xl items-center justify-center">
                <Ionicons name="close" size={24} color={isDark ? '#fafafa' : '#09090b'} />
              </Pressable>
            )}
            <Pressable
              onPress={() => setIsCreating(true)}
              className="w-10 h-10 rounded-xl bg-primary items-center justify-center"
            >
              <Ionicons name="add" size={24} color={isDark ? '#09090b' : '#f8fafc'} />
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-center bg-input rounded-xl border border-border px-3">
          <Ionicons name="search" size={18} color={isDark ? '#a1a1aa' : '#64748b'} />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor={isDark ? '#a1a1aa' : '#64748b'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 py-3 px-2 text-foreground"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={isDark ? '#a1a1aa' : '#64748b'} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView className="flex-1">
        {filteredNotes.length === 0 ? (
          <View className="p-8 items-center">
            <Ionicons name="document-outline" size={48} color={isDark ? '#4b5563' : '#94a3b8'} />
            <Text variant="caption" className="mt-2">No notes yet</Text>
          </View>
        ) : (
          filteredNotes.map((note) => (
            <Pressable
              key={note.id}
              onPress={() => handleSelectNote(note.id)}
              className="px-4 py-3 border-b border-border active:bg-accent"
            >
              <Text variant="bold" className="mb-1">{note.title}</Text>
              <Text variant="caption" numberOfLines={1}>
                {note.content.replace(/[#*`\[\]]/g, '').substring(0, 60)}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Modal visible={isCreating} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center items-center" onPress={() => setIsCreating(false)}>
          <Pressable className="w-80 bg-card rounded-2xl p-6 border border-border" onPress={(e) => e.stopPropagation()}>
            <Text variant="subtitle" className="mb-4">New Note</Text>
            <TextInput
              placeholder="Note title..."
              placeholderTextColor={isDark ? '#a1a1aa' : '#64748b'}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
              className="bg-input px-4 py-3 rounded-xl border border-border text-foreground mb-4"
              onSubmitEditing={handleCreateNote}
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => { setIsCreating(false); setNewTitle(''); }}
                className="flex-1 py-3 rounded-xl border border-border items-center"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreateNote}
                className="flex-1 py-3 rounded-xl bg-primary items-center"
              >
                <Text className="text-primary-foreground font-bold">Create</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );

  if (isWeb) {
    return (
      <View className="w-72 border-r border-border">
        {content}
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1">
        {content}
      </View>
    </Modal>
  );
}
