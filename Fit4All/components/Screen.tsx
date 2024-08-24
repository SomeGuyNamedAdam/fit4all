import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, ScrollViewProps, ViewProps } from 'react-native';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle; // Allow additional styles to be passed in
  type?: 'view' | 'scroll'; // Determines whether to render View or ScrollView
  scrollProps?: ScrollViewProps; // Props to be passed to ScrollView if type is 'scroll'
}

const Screen: React.FC<ScreenProps> = ({ children, style, type = 'view', scrollProps }) => {
  if (type === 'scroll') {
    return (
      <ScrollView style={[styles.container, style]} {...scrollProps}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
    flex: 1
  },
});

export default Screen;
