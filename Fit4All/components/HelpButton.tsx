import { useThemeColor } from '@/hooks/useThemeColor';
import { Alert, StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export type HelpButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
  message: string;
  messageTitle: string;
};

export default function HelpButton({
  style,
  lightColor,
  darkColor,
  title,
  message,
  messageTitle,
  ...rest
}: HelpButtonProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text'); 

  const handleShowHelp = () => {
    Alert.alert(
      `${messageTitle}`,
      `${message}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK"}
      ]
    );
  }


  return (
    <TouchableOpacity
      style={[
        styles.base,
        style,
      ]}
      {...rest}
      onPress={() => {handleShowHelp()}}
    >
      <Text
        style={[
          styles.text,
          { color },
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
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
