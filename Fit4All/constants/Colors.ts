/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    surface: '#fff',
    primary: '#6301ee',
    secondary: '',
    onBackground: '#151718',
    onSurface: '#151718',
    onPrimary: '',
    onSecondary: '',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#ff0000',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#bb86fc',
    onPrimary: '#000505',
    secondary: '#04dac6',
    onSecondary: '#000505',
    background: '#151718',
    onBackground: '#a1a1a1',
    surface: '#1d1d1d',
    onSurface: '#d9d9d9',
    text: '#ECEDEE',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#00ff00',
    tabIconSelected: tintColorDark,
    
  },
};
