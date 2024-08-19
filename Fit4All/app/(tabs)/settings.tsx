import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import RNRestart from 'react-native-restart';

// Constants for setting keys
const THEME_KEY = 'theme';
const WEIGHT_UNIT_KEY = 'weightUnit';
const ENERGY_UNIT_KEY = 'energyUnit';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isKg, setIsKg] = useState(false);
  const [isKcal, setIsKcal] = useState(false);
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
          setIsKg(weightUnit === 'kg');
        }

        if (energyUnit !== null) {
          setIsKcal(energyUnit === 'kcal');
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
        await AsyncStorage.setItem(WEIGHT_UNIT_KEY, isKg ? 'kg' : 'lbs');
        await AsyncStorage.setItem(ENERGY_UNIT_KEY, isKcal ? 'kj' : 'kcal');
      } catch (error) {
        console.error('Failed to save settings', error);
      }
    };

    saveSettings();
  }, [isDarkMode, isKg, isKcal]);

  // Handle theme toggle
  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Handle weight unit toggle
  const handleWeightUnitToggle = () => {
    setIsKg(prevUnit => !prevUnit);
  };

  // Handle energy unit toggle
  const handleEnergyUnitToggle = () => {
    setIsKcal(prevUnit => !prevUnit);
  };

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
              alert('All data has been erased. Restarting the app...');
            } catch (error) {
              console.error('Failed to clear AsyncStorage', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.option}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={handleThemeToggle} />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Weight Unit (kg/lbs)</Text>
        <Switch value={isKg} onValueChange={handleWeightUnitToggle} />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Energy Unit (kcal/kJ)</Text>
        <Switch value={isKcal} onValueChange={handleEnergyUnitToggle} />
      </View>

      <Button title="Erase All Data" onPress={handleEraseData} color="#FF6347" />

      <Button
        title="About"
        onPress={() => router.push('/about')}
        color="#4682B4"
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
});
