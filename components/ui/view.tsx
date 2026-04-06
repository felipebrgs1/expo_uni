import { View as RNView, type ViewProps, SafeAreaView as RNSafeAreaView } from 'react-native';
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

export function SafeAreaView({ className = '', ...props }: ViewProps & { className?: string }) {
  return (
    <RNSafeAreaView 
      className={`flex-1 bg-background ${className}`} 
      {...props} 
    />
  );
}
