import React from 'react';
import { TextInput, type TextInputProps, StyleSheet, View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'outlined' | 'rounded' | 'underline';
  label?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  label,
  type = 'default',
  ...rest
}: ThemedTextInputProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const bgColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');
  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TextInput
        style={[
          { color : textColor,
            backgroundColor: bgColor,
            borderColor: textColor
           },
          type === 'default' ? styles.default : undefined,
          type === 'outlined' ? styles.outlined : undefined,
          type === 'rounded' ? styles.rounded : undefined,
          type === 'underline' ? styles.underline : undefined,
          style,
        ]}
        placeholderTextColor={textColor} // Ensures placeholder text is also themed
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8, // Add vertical margin to separate label and input
  },
  label: {
    fontSize: 14,
    marginBottom: 4, // Space between label and input
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
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
