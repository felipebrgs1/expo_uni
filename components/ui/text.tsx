import { Text as RNText, type TextProps } from 'react-native';
import React from 'react';

type Variant = 'default' | 'title' | 'subtitle' | 'caption' | 'bold';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: 'text-sm text-foreground',
  title: 'text-2xl font-black text-foreground',
  subtitle: 'text-lg font-bold text-foreground',
  caption: 'text-xs text-muted-foreground',
  bold: 'text-sm font-bold text-foreground',
};

export function Text({ variant = 'default', className = '', ...props }: CustomTextProps) {
  return (
    <RNText 
      className={`${variants[variant]} ${className}`} 
      {...props} 
    />
  );
}
