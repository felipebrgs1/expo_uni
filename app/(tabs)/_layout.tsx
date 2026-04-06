import React from 'react';
import { View } from '@/components/ui/view';
import { Sidebar } from '@/components/sidebar';

export default function TabLayout() {
  return (
    <View className="flex-1 flex-row">
      <Sidebar />
    </View>
  );
}
