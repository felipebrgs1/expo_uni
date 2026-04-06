import React from 'react';
import { View, Text } from 'react-native';
import { useNoteStore } from '@/stores/note-store';
import { GraphView } from '@/components/graph-view';
import { useRouter } from 'expo-router';

export default function GraphTab() {
  const { graphData, setActiveNote } = useNoteStore();
  const router = useRouter();

  const handleNodePress = (id: string) => {
    setActiveNote(id);
    router.push('/');
  };

  return (
    <View className="flex-1 bg-background pt-10">
      <View className="px-4 py-2 border-b border-border">
        <Text className="text-xl font-bold text-foreground">Graph View</Text>
        <Text className="text-sm text-muted-foreground">Pinch to zoom, drag to pan</Text>
      </View>
      <GraphView data={graphData} onNodePress={handleNodePress} />
    </View>
  );
}
