import React from 'react';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPickerProps = PickerProps & {
  lightColor?: string;
  items : {label : string; value : string}[];
  darkColor?: string;
  type?: 'default';
  pickerStyle? : TextStyle;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  selectedValue: string;
  placeholder? :string
};

export function ThemedPicker({
  style,
  lightColor,
  darkColor,
  selectedValue,
  onValueChange,
  items,
  pickerStyle,
  placeholder
}: ThemedPickerProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    marginVertical: 10
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
