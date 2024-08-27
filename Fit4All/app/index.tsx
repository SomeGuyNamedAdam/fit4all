import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';

import Screen from "@/components/Screen";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import Checkbox from "@/components/Checkbox";
import { useThemeColor } from "@/hooks/useThemeColor";

const Index = () => {
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(true);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    checkHomeVisit();
  }, []);

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

  const handleHomeButton = () => {
    if (isPrivacyChecked && isTermsChecked) {
      router.navigate("/setup");
    } else {
      Alert.alert(
        "Attention",
        "You need to accept our privacy policy and terms to proceed.",
        [{ text: "OK" }]
      );
      setIsError(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.gradientBackground}
    >
      <Screen type="scroll" style={styles.screen}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.contentContainer}>
          <ThemedText type="title" style={styles.title}>
            Welcome to Fit4All
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Created by Adam Lenardt (AgrestJam)
          </ThemedText>
          
          <View style={styles.featureContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Key Features:
            </ThemedText>
            <ThemedText style={styles.feature}>• Log meals, exercises, and weight</ThemedText>
            <ThemedText style={styles.feature}>• View nutrient values for meals</ThemedText>
            <ThemedText style={styles.feature}>• Track calories eaten and burned</ThemedText>
          </View>

          <ThemedText style={styles.longText}>
            This app was created as part of the "Mazowiecki Program Stypendialny dla uczniów szkół zawodowych" scholarship program.
          </ThemedText>

          <View style={styles.agreementContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              User Agreements
            </ThemedText>
            <Checkbox
              title="Accept privacy policy"
              value={isPrivacyChecked}
              onChange={setIsPrivacyChecked}
              style={isError ? styles.errorCheckbox : styles.checkbox}
            />
            <Checkbox
              title="Accept terms and conditions"
              value={isTermsChecked}
              onChange={setIsTermsChecked}
              style={isError ? styles.errorCheckbox : styles.checkbox}
            />
          </View>

          <ThemedButton
            title="Get Started"
            style={styles.primaryButton}
            onPress={handleHomeButton}
          />
          <View style={styles.secondaryButtonsContainer}>
            <ThemedButton
              title="Privacy Policy"
              style={styles.secondaryButton}
              type="info"
              onPress={() => router.push("/privacy")}
            />
            <ThemedButton
              title="Terms of Service"
              style={styles.secondaryButton}
              type="info"
              onPress={() => router.push("/terms")}
            />
          </View>
        </View>
      </Screen>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  featureContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ffffff',
  },
  longText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#e0e0e0',
  },
  agreementContainer: {
    marginBottom: 20,
  },
  checkbox: {
    marginBottom: 10,
  },
  errorCheckbox: {
    marginBottom: 10,
    borderColor: "#ff0000",
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;