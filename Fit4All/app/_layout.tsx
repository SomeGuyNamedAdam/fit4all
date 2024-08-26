import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native'; // import Appearance
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('light'); // Default to 'light'
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setColorScheme(storedTheme === 'dark' ? 'dark' : 'light');
          Appearance.setColorScheme(storedTheme === 'dark' ? 'dark' : 'light')
        } else {
          const systemScheme = Appearance.getColorScheme(); // Get the system scheme
          setColorScheme(systemScheme);
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage', error);
      }
    };

    loadTheme(); // Call the async function

    // Listen for changes in color scheme
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme); // Update state when the system theme changes
    });

    return () => {
      // Clean up the listener on unmount
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        
      <Stack.Screen name="index"  options={{ title : "Fit4All", animation: 'none'}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
  
      </Stack>
    </ThemeProvider>
  );
}
