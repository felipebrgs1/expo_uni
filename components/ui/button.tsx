import { Pressable, type PressableProps } from 'react-native';
import { Text } from './text';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

interface ButtonProps extends PressableProps {
  label: string;
  className?: string;
  variant?: Variant;
}

const variants: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary px-6 py-4 rounded-xl active:opacity-90 items-center justify-center shadow-sm',
    text: 'text-primary-foreground font-bold text-lg',
  },
  secondary: {
    container: 'bg-secondary px-6 py-4 rounded-xl active:opacity-90 items-center justify-center',
    text: 'text-secondary-foreground font-bold text-lg',
  },
  outline: {
    container: 'border border-border bg-transparent px-6 py-4 rounded-xl active:bg-accent items-center justify-center',
    text: 'text-foreground font-bold text-lg',
  },
  ghost: {
    container: 'px-6 py-4 rounded-xl active:bg-accent items-center justify-center',
    text: 'text-foreground font-medium text-lg',
  },
  destructive: {
    container: 'bg-destructive px-6 py-4 rounded-xl active:opacity-90 items-center justify-center',
    text: 'text-destructive-foreground font-bold text-lg',
  },
};

export function Button({ label, variant = 'primary', className = '', ...props }: ButtonProps) {
  const styles = variants[variant];
  return (
    <Pressable className={`${styles.container} ${className}`} {...props}>
      <Text className={styles.text}>{label}</Text>
    </Pressable>
  );
}
