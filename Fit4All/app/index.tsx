import Checkbox from "@/components/Checkbox";
import FeatureBox from "@/components/FeatureBox";
import Screen from "@/components/Screen";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";


const Index = () => {
  const textColor = useThemeColor({}, "text");
  const [loading, setLoading] = useState(true);
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
        router.navigate("/setup");
    } else {
      Alert.alert(
        "Attention",
        "You need to accept our privacy policy if you wish to proceed further",
        [{ text: "OK" }]
      );
      setIsError(true);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


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
      <ThemedText type="subtitle">Key features</ThemedText>
      <FeatureBox title={"Comprehensive Tracking"} message={"Log your meals, exercises and weight to keep track of your journey"} ionicon={"analytics-sharp"} color="#145adb"/>
      <FeatureBox title={"Nutrient Insights"} message={"Get detailed breakdowns of meal nutrients to ensure dietary goals"} ionicon={"nutrition"} color="#82bf92"/>
      <FeatureBox title={"Calorie Management"} message={"Keep an eye on your calorie intake and expenditure"} ionicon={"flame-sharp"} color="#e67255"/>
      <ThemedText type="subtitle">User agreements</ThemedText>
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
        title={"Get Started"}
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
