import { Appearance, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Screen from '@/components/Screen'
import { ThemedText } from '@/components/ThemedText'
import ThemedButton from '@/components/ThemedButton'
import ThemedTextInput from '@/components/ThemedTextInput'
import { ThemedPicker } from '@/components/ThemedPicker'
import { useThemeColor } from '@/hooks/useThemeColor'
import { handleInputChange, handleNumberInputChange } from '@/utils/inputHandler'
import countryCodes from "@/assets/datasets/country_codes.json";
import { CountryCodes, WeightData } from '@/types'
import { router, Stack } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const setup = () => {
  const textColor = useThemeColor({}, "text");
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [energyUnit, setEnergyUnit] = useState("kcal");

  const getCountryItems = (language: string) => {
    const countries = (countryCodes as CountryCodes)[language] || [];
  
    return countries.map((country: string) => {
      return {
        label: capitalizeWords(country.split("-").join(" ")),
        value: country.toLowerCase(), // You can use the lowercase value as the key
      };
    });
  };

  const capitalizeWords = (text: string) => {
    return text
      .split(" ")
      .map((word) => {
        if (word.toLowerCase() === "and") {
          return word.toLowerCase(); // Keep "and" in lowercase
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize other words
      })
      .join(" ");
  };

  
  const countryItems = getCountryItems("en");
  const getTheme = () => {
    return isDarkMode ? "Enable light mode" : "Enable dark mode";
  };

  const handleThemeToggle = () => {
    const theme = Appearance.getColorScheme();
    if (theme == "light") {
      Appearance.setColorScheme("dark");
      setIsDarkMode(true);
    } else {
      Appearance.setColorScheme("light");
      setIsDarkMode(false);
    }
    // () => {Appearance.setColorScheme('light')}
    
  };

  const handleHomeButton = async () => {
      try {
        if (weight.length > 0) {
          const newWeightEntry: WeightData = {
            value: parseFloat((parseFloat(weight) / (weightUnit === "kg" ? 1 : 2.205)).toFixed(2)),
            date: new Date(),
          };
          const existingWeightsString = await AsyncStorage.getItem("weights");
          const weightTrackerArray = existingWeightsString
            ? JSON.parse(existingWeightsString)
            : [];
          weightTrackerArray.push(newWeightEntry);
          await AsyncStorage.setItem(
            "weights",
            JSON.stringify(weightTrackerArray)
          );
        }
        if (country.length > 0) {
          await AsyncStorage.setItem("userCountry", `${country}`);
        }
        // const THEME_KEY = 'theme';
        // const WEIGHT_UNIT_KEY = 'weightUnit';
        // const ENERGY_UNIT_KEY = 'energyUnit';
        await AsyncStorage.setItem("theme", isDarkMode ? "dark" : "light");
        await AsyncStorage.setItem("weightUnit", weightUnit);
        await AsyncStorage.setItem("energyUnit", energyUnit);
        // Set flag indicating that the home page has been visited
        await AsyncStorage.setItem("hasVisitedHome", "true");
      } catch (error) {
        console.error(error);
      } finally {
        router.navigate("/(tabs)/home");
      }
    
  };

  return (
    <Screen type='scroll'>
      <Stack.Screen
        options={{
          headerTitle: "Terms of Service",
          headerTintColor: textColor, // Use the dynamic theme-based color for header elements
          headerTitleStyle: {
            color: textColor, // Apply theme-based color to the header title
          },
        }}
      />
      <ThemedText type="subtitle">Enter data</ThemedText>
      <ThemedText>
        {"\u00A0".repeat(4)}You can enter base data here, or do it later within
        the app.
      </ThemedText>
      <ThemedTextInput
        label="Weight"
        value={weight}
        onChangeText={(text) => handleNumberInputChange(text, setWeight)}
      />
      <ThemedPicker
        selectedValue={weightUnit}
        onValueChange={(itemValue) => setWeightUnit(itemValue as string)} // Cast to string
        items={[
          { label: "Kilograms (kg)", value: "kg" },
          { label: "Pounds (lbs)", value: "lbs" },
        ]}
        label="Choose weight unit"
      />
      <ThemedPicker
        selectedValue={country}
        onValueChange={(itemValue) =>
          handleInputChange(itemValue as string, setCountry)
        }
        items={countryItems}
        placeholder="Click to select"
        label="Choose a country"
      />
      <ThemedPicker
        selectedValue={energyUnit}
        onValueChange={(itemValue) => setEnergyUnit(itemValue as string)} // Cast to string
        items={[
          { label: "Kilocalories (kcal)", value: "kcal" },
          { label: "Kilojoules (kJ)", value: "kj" },
        ]}
        label="Choose energy unit"
      />
      <View
        style={[
          { flex: 1, flexDirection: "row", alignItems: "center" },
        ]}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            paddingTop: 10,
          }}
        >
          <ThemedText
            style={[
              {
                fontSize: 18,
                marginBottom: 10,
                flex: 1,
                textAlignVertical: "center",
                paddingVertical: 10,
                height: "100%",
              },
            ]}
          >
            App Theme:{" "}
          </ThemedText>
        </View>
        <ThemedButton
          type="primary"
          title={getTheme()}
          onPress={handleThemeToggle}
          style={{ flex: 1 }}
        />
      </View>
      <ThemedButton title='Go to App' onPress={() => {handleHomeButton()}}></ThemedButton>
    </Screen>
  )
}

export default setup

const styles = StyleSheet.create({})