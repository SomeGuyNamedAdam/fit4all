import Screen from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const terms = () => {
  const textColor = useThemeColor({}, "text");
  return (
    <Screen type="scroll" style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Terms of Service",
          headerTintColor: textColor, // Use the dynamic theme-based color for header elements
          headerTitleStyle: {
            color: textColor, // Apply theme-based color to the header title
          },
        }}
      />
      <ThemedText type="default">Created by Adam Lenardt</ThemedText>
      <ThemedText type="title">Fit4All - Terms of Service</ThemedText>
      <ThemedText>Last Updated: 26/08/2024</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {" "}
        Introduction
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Welcome to Fit4All! These Terms of Service ("ToS")
        govern your use of the Fit4All mobile application ("App"), operated by
        Adam Lenardt. By using the App, you agree to these terms. If you do not
        agree, please do not use the App.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {" "}
        Eligibility
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Fit4All is intended for users who are 13 years of
        age or older. By using the App, you affirm that you meet this age
        requirement.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        App Description
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Fit4All is a nutrition, exercise, and weight tracker
        designed to help users manage their health and fitness. The App allows
        you to log meals, workouts, and weight, and provides nutritional
        information through integration with the OpenFoodFacts API.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        User Responsibilities
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}You agree to use Fit4All responsibly and in
        accordance with the following guidelines: Spamming Prohibited: You must
        not spam search requests. The App relies on the OpenFoodFacts API, which
        may block your IP if more than 100 requests are sent per minute.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Prohibited Activities
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}The App is designed solely for tracking meals,
        workouts, and weight. Users are prohibited from attempting to misuse the
        App in any way, including but not limited to attempting to exploit any
        vulnerabilities or interfere with the App's functionality.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Account Creation
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Fit4All does not require users to create an account.
        All data is stored locally on your device.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Termination of Service
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)} If you exceed the limit of 100 requests per minute
        to the OpenFoodFacts API, your IP may be temporarily or permanently
        blocked from accessing the API, which may limit the App’s functionality.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Intellectual Property
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}The Fit4All App and its content are the intellectual
        property of Adam Lenardt. You are granted a non-exclusive,
        non-transferable license to use the App for personal purposes only. Any
        unauthorized use of the App or its content is prohibited.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        User-Generated Content
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Fit4All does not allow users to upload or share
        content. All data input into the App is stored locally and is not shared
        with other users.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Payments and Subscriptions
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Fit4All is completely free to use. There are no
        in-app purchases, subscriptions, or advertisements.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Privacy and Data Collection
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Fit4All collects the following data from users: Meal
        Data: Including calories and nutrient content. Workout Data: Including
        activity type and duration. Weight Data: Body weight information.
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}All data is provided by the user and stored locally
        on the device. The App does not collect data automatically or share it
        with third parties, except for the integration with the OpenFoodFacts
        API, which retrieves nutritional information.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {" "}
        Third-Party Services
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}The App integrates with the OpenFoodFacts API to
        provide nutritional information. No personal data is shared with
        OpenFoodFacts, and it is only used to retrieve relevant product data.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {" "}
        Disclaimers and Liability
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)} Data Accuracy: Nutritional data provided by the App
        is sourced from the OpenFoodFacts API and is intended as an
        approximation. We do not guarantee the accuracy of this information. No
        Medical Advice: The App is not intended to provide medical advice.
        Always consult a healthcare professional for medical or dietary advice.
        Limitation of Liability: Adam Lenardt is not liable for any damages or
        losses resulting from the use or inability to use the App, including but
        not limited to inaccuracies in data, IP blocking by the OpenFoodFacts
        API, or any other issues related to the App’s functionality.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Governing Law{" "}
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}These Terms of Service are governed by and construed
        in accordance with the laws of Poland. Any disputes arising under or
        related to these terms shall be subject to the exclusive jurisdiction of
        the Polish courts.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Dispute Resolution{" "}
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}By using this App, you agree that any disputes will
        be resolved informally, and no formal disputes will take place, as the
        App is provided "as-is" without warranties.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Changes to These Terms{" "}
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}We may update these Terms of Service from time to
        time. If changes are made, we will notify you through an in-app
        notification. Continued use of the App after changes are posted
        constitutes your acceptance of the revised terms.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        User Agreement
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}You must accept these Terms of Service to use the
        Fit4All App. Acceptance occurs on the first page of the App, where users
        are prompted to agree to these terms before entering.
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Contact Information
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}If you have any questions about these Terms of
        Service, please contact us at:
      </ThemedText>
      <ThemedText style={styles.text}>{"\u00A0".repeat(4)}Fit4All</ThemedText>
      <ThemedText style={styles.text}>{"\u00A0".repeat(4)}AgrestJam</ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}agrestjam@gmail.com
      </ThemedText>
      <ThemedText style={styles.text}>
        {"\u00A0".repeat(4)}Adam Lenardt
      </ThemedText>
      <ThemedText></ThemedText>
    </Screen>
  );
};

export default terms;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
    marginBottom: 100,
    paddingBottom: 30,
  },
  listContainer: {
    paddingVertical: 20,
  },
  listItem: {
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 10,
  },
  text: {
    textAlign: "justify",
  },
});
