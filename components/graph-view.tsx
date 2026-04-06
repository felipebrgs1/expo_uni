import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, LayoutChangeEvent, useWindowDimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Canvas, Line, Circle } from '@shopify/react-native-skia';
import * as d3 from 'd3-force';
import type { GraphData, GraphNode, GraphEdge } from '@/lib/graph';
import { useTheme } from '@/components/theme-provider';

interface SimulationNode extends d3.SimulationNodeDatum, GraphNode {
  radius: number;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: string | SimulationNode;
  target: string | SimulationNode;
}

export function GraphView({ data, onNodePress }: { data: GraphData, onNodePress?: (id: string) => void }) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Graph state
  const [nodes, setNodes] = useState<SimulationNode[]>([]);
  const [links, setLinks] = useState<SimulationLink[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Pan and Zoom shared values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Initialize D3 Force Simulation
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || data.nodes.length === 0) return;

    const simNodes: SimulationNode[] = data.nodes.map((n) => ({
      ...n,
      radius: 8 + Math.min(n.backlinks.length * 2, 20), // Bigger nodes for more backlinks
    }));

    const simLinks: SimulationLink[] = data.edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const simulation = d3.forceSimulation<SimulationNode>(simNodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(centerX, centerY))
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(simLinks).id((d) => d.title.toLowerCase()).distance(100))
      .force('collide', d3.forceCollide().radius((d: any) => d.radius + 10).iterations(2));

    // Fast-forward simulation for instant rendering
    simulation.tick(300);
    simulation.stop();

    setNodes([...simNodes]);
    setLinks([...simLinks]);

  }, [data, dimensions]);

  // Gestures
  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const containerStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  const linkColor = isDark ? '#374151' : '#e5e7eb';
  const nodeColor = isDark ? '#38bdf8' : '#0ea5e9';
  const textColor = isDark ? '#fafafa' : '#111827';

  return (
    <View className="flex-1 overflow-hidden bg-background" onLayout={handleLayout}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <GestureDetector gesture={composed}>
          <Animated.View style={containerStyle}>
            {/* Background Line Layer via Skia */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <Canvas style={{ flex: 1 }}>
                {links.map((link, i) => {
                  const source = link.source as SimulationNode;
                  const target = link.target as SimulationNode;
                  if (source.x == null || source.y == null || target.x == null || target.y == null) return null;
                  return (
                    <Line
                      key={`link-${i}`}
                      p1={{ x: source.x, y: source.y }}
                      p2={{ x: target.x, y: target.y }}
                      color={linkColor}
                      strokeWidth={2}
                    />
                  );
                })}
                {nodes.map((node) => {
                  if (node.x == null || node.y == null) return null;
                  return (
                    <Circle
                      key={`circle-${node.id}`}
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      color={nodeColor}
                    />
                  );
                })}
              </Canvas>
            </View>

            {/* Foreground Text Layer via React Native */}
            {nodes.map((node) => {
              if (node.x == null || node.y == null) return null;
              return (
                <View
                  key={`text-${node.id}`}
                  style={{
                    position: 'absolute',
                    left: node.x + node.radius + 4,
                    top: node.y - 10,
                  }}
                  onTouchEnd={() => onNodePress?.(node.id)}
                >
                  <Text style={{ color: textColor, fontWeight: 'bold' }}>{node.title}</Text>
                </View>
              );
            })}
          </Animated.View>
        </GestureDetector>
      )}
    </View>
  );
}
