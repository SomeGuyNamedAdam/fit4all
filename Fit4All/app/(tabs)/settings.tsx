import Screen from "@/components/Screen";
import ThemedButton from "@/components/ThemedButton";
import { ThemedPicker } from "@/components/ThemedPicker";
import { ThemedText } from "@/components/ThemedText";
import { handleInputChange } from "@/utils/inputHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Appearance, StyleSheet, View } from "react-native";
import countryCodes from "@/assets/datasets/country_codes.json"; 
import { CountryCodes } from "@/types";
import { center, TextAlign } from "@shopify/react-native-skia";

// Constants for setting keys
const THEME_KEY = "theme";
const WEIGHT_UNIT_KEY = "weightUnit";
const ENERGY_UNIT_KEY = "energyUnit";

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [energyUnit, setEnergyUnit] = useState("kcal");
  
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const theme = await AsyncStorage.getItem(THEME_KEY);
        const weightUnit = await AsyncStorage.getItem(WEIGHT_UNIT_KEY);
        const energyUnit = await AsyncStorage.getItem(ENERGY_UNIT_KEY);
        const country = await AsyncStorage.getItem('userCountry')

        if (theme !== null) {
          setIsDarkMode(theme === "dark");
        }

        if (weightUnit !== null) {
          setWeightUnit(weightUnit);
        }

        if (energyUnit !== null) {
          setEnergyUnit(energyUnit);
        }
        if (country !== null)  {
          setCountry(country)
          console.log(country)
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };
    const fetchData = async () => {
      try {
        await loadSettings();
      } catch (error) {
        console.error
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
        await AsyncStorage.setItem(WEIGHT_UNIT_KEY, weightUnit);
        await AsyncStorage.setItem(ENERGY_UNIT_KEY, energyUnit);
        await AsyncStorage.setItem('userCountry', country.toLowerCase());
        
      } catch (error) {
        console.error("Failed to save settings", error);
      }
    };

    saveSettings();
  }, [isDarkMode, weightUnit, energyUnit, country]);

  // Handle theme toggle
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

  const getTheme = () => {
    const theme = Appearance.getColorScheme();
    return isDarkMode ? "Enable light mode" : "Enable dark mode";
  };

  // Confirm and erase all data
  const handleEraseData = () => {
    Alert.alert(
      "Erase All Data",
      "Are you sure you want to delete all data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              alert("All data has been erased.");
              router.replace("/");
            } catch (error) {
              console.error("Failed to clear Storage", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
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

  const getCountryItems = (language: string) => {
    const countries = (countryCodes as CountryCodes)[language] || [];
  
    return countries.map((country: string) => {
      return {
        label: capitalizeWords(country.split("-").join(" ")),
        value: country.toLowerCase(), // You can use the lowercase value as the key
      };
    });
  };
  const countryItems = getCountryItems("en");

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Screen type="scroll">
      <ThemedText type="title">Settings</ThemedText>

      <View
        style={[
          styles.option,
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
              styles.label,
              {
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
      <View style={styles.option}>
        <ThemedPicker
          selectedValue={country}
          onValueChange={(itemValue) =>
            handleInputChange(itemValue as string, setCountry)
          }
          items={countryItems}
          label="Choose a country"
        />
      </View>

      <View style={styles.option}>
        <ThemedPicker
          selectedValue={weightUnit}
          style={styles.picker}
          label="Weight Unit"
          onValueChange={(itemValue) => setWeightUnit(itemValue as string)} // Cast to string
          items={[
            { label: "Kilograms (kg)", value: "kg" },
            { label: "Pounds (lbs)", value: "lbs" },
          ]}
        />
      </View>

      <View style={styles.option}>
        <ThemedPicker
          selectedValue={energyUnit}
          style={styles.picker}
          label="Energy Unit"
          onValueChange={(itemValue) => setEnergyUnit(itemValue as string)} // Cast to string
          items={[
            { label: "Kilocalories (kcal)", value: "kcal" },
            { label: "Kilojoules (kJ)", value: "kj" },
          ]}
        />
      </View>

      <ThemedButton
        type="danger"
        title="Erase All Data"
        style={styles.button}
        onPress={handleEraseData}
      />

      <ThemedButton
        title="Privacy Policy"
        type="info"
        onPress={() => router.push("/privacy")}
        style={styles.button}
      />
      <ThemedButton
        title="Terms of Service"
        type="info"
        onPress={() => router.push("/terms")}
        style={styles.button}
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
    fontWeight: "bold",
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
    width: "100%",
  },
  button: {
    marginVertical: 5,
  },
});

export default Settings;
