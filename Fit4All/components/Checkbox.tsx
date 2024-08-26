import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';

export type CheckBoxProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
  style?: any; // Accept a style prop
};

function Checkbox({
  lightColor,
  darkColor,
  title,
  value,
  onChange,
  style,  // Receive the style prop
  ...rest
}: CheckBoxProps) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      style={[styles.checkboxContainer, style]}  // Apply the style prop here
      {...rest}
    >
      <MaterialIcons
        name={value ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={value ? '#06b6d4' : '#64748b'}
      />
      <ThemedText>{title}</ThemedText>
    </TouchableOpacity>
  );
}

export default Checkbox;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
