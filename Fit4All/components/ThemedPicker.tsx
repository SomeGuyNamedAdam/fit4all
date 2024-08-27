import { useThemeColor } from '@/hooks/useThemeColor';
import { Picker, PickerProps } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { ThemedText } from './ThemedText';

export type ThemedPickerProps = PickerProps & {
  lightColor?: string;
  items : {label : string; value : string}[];
  darkColor?: string;
  type?: 'default';
  pickerStyle? : TextStyle;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  selectedValue: string;
  placeholder? :string;
  label? : string;
};

export function ThemedPicker({
  style,
  lightColor,
  darkColor,
  selectedValue,
  onValueChange,
  items,
  pickerStyle,
  placeholder,
  label
}: ThemedPickerProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <>
    {label && <ThemedText style={styles.label}>{label}</ThemedText>}
    <View style={[styles.container, { backgroundColor, borderColor: textColor }, style]}>
      
      <Picker
        dropdownIconColor={textColor}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[styles.picker, { color: textColor }, pickerStyle]}
        placeholder={placeholder}
        numberOfLines={3}
        >
        {placeholder && !selectedValue && <Picker.Item label={placeholder} value="" />}
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
  },
  picker: {
    minHeight: 50,
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 4, // Space between label and input
  },
});
