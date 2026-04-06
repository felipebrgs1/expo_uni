import { TextInput, type TextInputProps, View } from 'react-native';
import { Text } from './text';
import React from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  className?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text variant="caption" className="mb-1.5 ml-1">{label}</Text>}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`bg-input px-4 py-4 rounded-xl border border-border text-foreground text-lg ${className}`}
        {...props}
      />
      {error && <Text className="text-destructive text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
}
