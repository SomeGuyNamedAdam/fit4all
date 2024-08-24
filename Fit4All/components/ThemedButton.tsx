import { TouchableOpacity, Text, StyleSheet, type TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
  title: string;
};

export default function ThemedButton({
  style,
  lightColor,
  darkColor,
  type = 'primary',
  title,
  ...rest
}: ThemedButtonProps) {
  // Determine default colors based on type
  const typeStyles = {
    primary: '#6301ee',
    secondary: '#04dac6',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    link: 'transparent', // Link has no background color
  };

  const textColorStyles = {
    primary: '#ffffff',
    secondary: '#ffffff',
    success: '#ffffff',
    danger: '#ffffff',
    warning: '#000000',
    info: '#ffffff',
    light: '#000000',
    dark: '#ffffff',
    link: '#007bff',
  };

  const backgroundColor = useThemeColor(
    { light: lightColor || typeStyles[type], dark: darkColor || typeStyles[type] },
    'secondary'
  );
  const textColor = useThemeColor(
    { light: lightColor ? '#ffffff' : textColorStyles[type], dark: darkColor ? '#ffffff' : textColorStyles[type] },
    'onSecondary'
  );

  return (
    <TouchableOpacity
      style={[
        styles.base,
        type === 'link' && styles.link, // Links don't have a background color
        { backgroundColor: type === 'link' ? 'transparent' : backgroundColor },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          type === 'link' && styles.linkText, // Link style
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    padding: 0,
  },
  linkText: {
    fontWeight: 'normal',
  },
});
