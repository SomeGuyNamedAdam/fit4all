import React from 'react';
import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'outlined' | 'rounded' | 'underline';
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'outlined' ? styles.outlined : undefined,
        type === 'rounded' ? styles.rounded : undefined,
        type === 'underline' ? styles.underline : undefined,
        style,
      ]}
      placeholderTextColor={color} // Ensures placeholder text is also themed
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  outlined: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  rounded: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  underline: {
    fontSize: 16,
    lineHeight: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default ThemedTextInput;
