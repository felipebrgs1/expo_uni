import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { GraphView } from '@/components/graph-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/theme-provider';

export default function GraphTab() {
  const router = useRouter();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const isWeb = Platform.OS === 'web';

  return (
    <View className="flex-1 bg-background pt-10">
      <View className="px-4 py-2 border-b border-border flex-row items-center justify-between">
        <View className="flex-row items-center">
          {isWeb && (
            <Pressable onPress={() => router.back()} className="mr-4 w-10 h-10 rounded-xl bg-secondary items-center justify-center">
              <Ionicons name="chevron-back" size={24} color={isDark ? '#fafafa' : '#09090b'} />
            </Pressable>
          )}
          <View>
            <Text className="text-xl font-bold text-foreground">Graph View</Text>
            <Text className="text-sm text-muted-foreground">Pinch to zoom, drag to pan</Text>
          </View>
        </View>
      </View>
      <GraphView />
    </View>
  );
}
