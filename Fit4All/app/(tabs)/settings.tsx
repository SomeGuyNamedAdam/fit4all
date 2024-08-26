import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { ThemedPicker } from '@/components/ThemedPicker';
import ThemedButton from '@/components/ThemedButton';
import Screen from '@/components/Screen';
import { Appearance } from 'react-native';

// Constants for setting keys
const THEME_KEY = 'theme';
const WEIGHT_UNIT_KEY = 'weightUnit';
const ENERGY_UNIT_KEY = 'energyUnit';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [energyUnit, setEnergyUnit] = useState('kcal');
  const router = useRouter();

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const theme = await AsyncStorage.getItem(THEME_KEY);
        const weightUnit = await AsyncStorage.getItem(WEIGHT_UNIT_KEY);
        const energyUnit = await AsyncStorage.getItem(ENERGY_UNIT_KEY);

        if (theme !== null) {
          setIsDarkMode(theme === 'dark');
        }

        if (weightUnit !== null) {
          setWeightUnit(weightUnit);
        }

        if (energyUnit !== null) {
          setEnergyUnit(energyUnit);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
        await AsyncStorage.setItem(WEIGHT_UNIT_KEY, weightUnit);
        await AsyncStorage.setItem(ENERGY_UNIT_KEY, energyUnit);
      } catch (error) {
        console.error('Failed to save settings', error);
      }
    };

    saveSettings();
  }, [isDarkMode, weightUnit, energyUnit]);

  // Handle theme toggle
  const handleThemeToggle = () => {
    const theme = Appearance.getColorScheme()
    if (theme == 'light') {
      Appearance.setColorScheme('dark') 
      setIsDarkMode(true)
    } else {
      Appearance.setColorScheme('light') 
      setIsDarkMode(false)
    }
    // () => {Appearance.setColorScheme('light')}
  };

  const getTheme = () => {
    const theme = Appearance.getColorScheme()
    return isDarkMode ? 'Enable light mode' :'Enable dark mode'
  }

  // Confirm and erase all data
  const handleEraseData = () => {
    Alert.alert(
      'Erase All Data',
      'Are you sure you want to delete all data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              alert('All data has been erased.');
              router.replace('/')
            } catch (error) {
              console.error('Failed to clear Storage', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Screen type='scroll'>
      <ThemedText type='title'>Settings</ThemedText>
      
      <View style={styles.option}>
        <ThemedText style={styles.label}>App Theme</ThemedText>
        <ThemedButton type='primary' title={getTheme()} onPress={handleThemeToggle} />
      </View>

      <View style={styles.option}>
        <ThemedText style={styles.label}>Weight Unit</ThemedText>
        <ThemedPicker
          selectedValue={weightUnit}
          style={styles.picker}
          onValueChange={(itemValue) => setWeightUnit(itemValue as string)} // Cast to string
          items ={[
            { label: 'Kilograms (kg)', value: 'kg'},
            { label: 'Pounds (lbs)', value: 'lbs'},
          ]}
        />
      </View>

      <View style={styles.option}>
        <ThemedText style={styles.label}>Energy Unit</ThemedText>
        <ThemedPicker
          
          selectedValue={energyUnit}
          style={styles.picker}
          onValueChange={(itemValue) => setEnergyUnit(itemValue as string)} // Cast to string
          items ={[
            { label: 'Kilocalories (kcal)', value: 'kcal'},
            { label: 'Kilojoules (kJ)', value: 'kj'},
          ]}
        />
      </View>

      <ThemedButton type='danger' title="Erase All Data" onPress={handleEraseData}/>

      <ThemedButton
        title="About"
        type='primary'
        onPress={() => router.push('/about')}
        
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Settings;
