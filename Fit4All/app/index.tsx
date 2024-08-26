import countryCodes from "@/assets/datasets/country_codes.json"; // import the JSON data
import Screen from "@/components/Screen";
import ThemedButton from "@/components/ThemedButton";
import { ThemedPicker } from "@/components/ThemedPicker";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  handleInputChange,
  handleNumberInputChange,
} from "@/utils/inputHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Appearance, StyleSheet, View } from "react-native";
import { WeightData, CountryCodes } from "@/types";
import Checkbox from "@/components/Checkbox";

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

const Index = () => {
  const textColor = useThemeColor({}, "text");
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg");
  const [energyUnit, setEnergyUnit] = useState("kcal");
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const checkHomeVisit = async () => {
      try {
        const hasVisitedHome = await AsyncStorage.getItem("hasVisitedHome");
        if (hasVisitedHome === "true") {
          router.navigate("/(tabs)/home");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking home visit:", error);
        setLoading(false);
      }
    };

    checkHomeVisit();
  }, []);

  const handleHomeButton = async () => {
    if (isPrivacyChecked && isTermsChecked) {
      try {
        if (weight.length > 0) {
          const newWeightEntry: WeightData = {
            value: parseFloat((parseFloat(weight) / (weightUnit === "kg" ? 1 : 2.205)).toFixed(0)),
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
          await AsyncStorage.setItem("userCountry", `en:${country}`);
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
    } else {
      Alert.alert(
        "Attention",
        "You need to accept our privacy policy if you wish to proceed further",
        [{ text: "OK" }]
      );
      setIsError(true);
    }
  };

  // Prepare the items for the picker based on the chosen language (e.g., 'en')
  const countryItems = getCountryItems("en");

  const getTheme = () => {
    return isDarkMode ? "Enable light mode" : "Enable dark mode";
  };

  if (loading) {
    return (
      // <View style={styles.loadingContainer}>
      //   <ActivityIndicator size="large" color={textColor} />
      // </View>
      <></>
    );
  }

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

  return (
    <Screen type="scroll" style={styles.screen}>
      <Stack.Screen
        options={{
          headerTitle: "Fit4All",
          headerTintColor: textColor,
          headerTitleStyle: {
            color: textColor,
          },
          headerShown: false,
        }}
      />
      <ThemedText type="title" style={styles.title}>
        Welcome to Fit4All
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Created by Adam Lenardt (AgrestJam)
      </ThemedText>
      <ThemedText style={styles.longText}>
        <ThemedText type="subtitle">Introduction</ThemedText>
        {"\n"}
        {"\u00A0".repeat(4)}The app focuses on providing easy, local, no paywall
        nutrient and workout data. Functionality allows users to:
        {"\n"}
        {"\u00A0".repeat(4)}
        {"\u2022"} Log their meals, exercises, and weight,
        {"\n"}
        {"\u00A0".repeat(4)}
        {"\u2022"} See nutrient value for their meals,
        {"\n"}
        {"\u00A0".repeat(4)}
        {"\u2022"} Keep track of eaten and burned food calories.
        {"\n"}
        {"\n"}
        {"\u00A0".repeat(4)}This app was created as a part of "Mazowiecki
        Program Stypendialny dla uczniów szkół zawodowych" scholarship program.
      </ThemedText>
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
      <ThemedText type="subtitle">User agreements</ThemedText>
      <ThemedText>
        {`\n`}{"\u00A0".repeat(4)} Before using the app you have to accept terms of
        service and privacy policy. Both are linked on the bottom of this page
        and in the settings tab{" "}{`\n`}
      </ThemedText>
      <Checkbox
        title="Accept privacy policy"
        value={isPrivacyChecked}
        onChange={setIsPrivacyChecked}
        style={
          isError
            ? {
                borderColor: "#ff0000",
                borderWidth: 2,
                borderRadius: 5,
                padding: 5,
              }
            : {}
        } // Pass the state setter to update the state
      />
      <Checkbox
        title="Accept terms and conditions"
        value={isTermsChecked}
        onChange={setIsTermsChecked}
        style={
          isError
            ? {
                borderColor: "#ff0000",
                borderWidth: 2,
                borderRadius: 5,
                padding: 5,
              }
            : {}
        } // Pass the state setter to update the state
      />
      <ThemedButton
        title={"Go to app"}
        style={styles.button}
        onPress={handleHomeButton}
      />
      <ThemedButton
        title={"Privacy Policy"}
        style={styles.button}
        type="info"
        onPress={() => {
          router.push("/privacy");
        }}
      />
      <ThemedButton
        title={"Terms of Service"}
        style={styles.button}
        type="info"
        onPress={() => {
          router.push("/terms");
        }}
      />
      <></>
    </Screen>
  );
};

export default Index;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  longText: {
    textAlign: "justify",
    marginVertical: 20,
  },
  screen: {
    marginTop: 50,
    marginVertical: 50,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 5,
  },
});
