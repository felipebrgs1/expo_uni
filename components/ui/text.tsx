import { Text as RNText, type TextProps } from 'react-native';
import React from 'react';

type Variant = 'default' | 'title' | 'subtitle' | 'caption' | 'bold';

interface CustomTextProps extends TextProps {
  className?: string;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: 'text-base text-foreground',
  title: 'text-3xl font-black text-foreground',
  subtitle: 'text-xl font-bold text-foreground',
  caption: 'text-sm text-muted-foreground',
  bold: 'text-base font-bold text-foreground',
};

export function Text({ variant = 'default', className = '', ...props }: CustomTextProps) {
  return (
    <RNText 
      className={`${variants[variant]} ${className}`} 
      {...props} 
    />
  );
}
