import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@/components/theme-provider';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width >= 768;

export default function TabLayout() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000000' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          display: isWeb ? 'none' : 'flex', // Hide tabs on Desktop Web since we have sidebar
        },
        tabBarActiveTintColor: isDark ? '#38bdf8' : '#0ea5e9',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Notes',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
