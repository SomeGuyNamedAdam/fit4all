import { View, type ViewProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedSurfaceProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'card' | 'modal' | 'header';
};

export function SurfaceView({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedSurfaceProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');

  return (
    <View
      style={[
        { backgroundColor },
        type === 'default' ? styles.default : undefined,
        type === 'card' ? styles.card : undefined,
        type === 'modal' ? styles.modal : undefined,
        type === 'header' ? styles.header : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    padding: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    padding: 12,
    borderRadius: 8,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modal: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    marginVertical: 5
  },
  header: {
    padding: 16,
    borderRadius: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
