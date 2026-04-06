import React from 'react';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import type { GraphData } from '@/lib/graph';

// Dynamic import for Web WebAssembly loading
const loadSkiaComponent = () => import('./graph-view-inner');

export function GraphView() {
  if (Platform.OS === 'web') {
    return (
      <WithSkiaWeb
        getComponent={loadSkiaComponent}
        opts={{ locateFile: (file) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.40.0/bin/full/${file}` }}
        fallback={
          <View className="flex-1 items-center justify-center bg-background">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-foreground">Loading Graph Engine...</Text>
          </View>
        }
      />
    );
  }

  // Native behavior (Android/iOS)
  const GraphViewInner = require('./graph-view-inner').default;
  return <GraphViewInner />;
}
