import { View as RNView, type ViewProps } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import React from 'react';

type Variant = 'default' | 'card' | 'input' | 'centered';

interface CustomViewProps extends ViewProps {
  className?: string;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: '',
  centered: 'items-center justify-center',
  card: 'bg-card p-6 rounded-3xl border border-border shadow-sm',
  input: 'bg-input px-4 py-3 rounded-2xl border border-border',
};

export function View({ variant = 'default', className = '', ...props }: CustomViewProps) {
  return (
    <RNView 
      className={`${variants[variant]} ${className}`} 
      {...props} 
    />
  );
}

const StyledSafeAreaView = withUniwind(RNSafeAreaView);

export function SafeAreaView({ className = '', ...props }: any) {
  return (
    <StyledSafeAreaView 
      className={`flex-1 bg-background ${className}`} 
      {...props} 
    />
  );
}
