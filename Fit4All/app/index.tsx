import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ThemedButton from '@/components/ThemedButton'
import { router, Stack } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Screen from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';



const index = () => {
  const textColor = useThemeColor({}, "text");
  const [weight, setWeight] = useState("")
  return (
    <Screen style={styles.screen}>
      <Stack.Screen
        options={{
          headerTitle: "Fit4All",
          headerTintColor: textColor, // Use the dynamic theme-based color for header elements
          headerTitleStyle: {
            color: textColor, // Apply theme-based color to the header title
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
        {"\u00A0".repeat(4)}The app focus on providing easy, local, no paywall
        nutrient and workout data. Functionality allows users to:
        {"\n"}
        {"\u00A0".repeat(4)}
        {"\u2022"} Log their meals,exercises and weight,
        {"\n"}
        {"\u00A0".repeat(4)}
        {"\u2022"} See nutrient value for their meals,
        {"\n"}
        {"\u00A0".repeat(4)}
        {"\u2022"} Keep truck of eaten and burned FoodCalories.
        {"\n"}
        {"\n"}
        {"\u00A0".repeat(4)}This app was created as a part of "Mazowiecki
        Program Stypendialny dla uczniów szkół zawodowych" scholarship program.
        </ThemedText>
        <ThemedText type="subtitle">Enter data</ThemedText>
        <ThemedText>
        {"\u00A0".repeat(4)}You can enter base data here, or do it later within the app.
        </ThemedText>
        <ThemedTextInput label='Weight (kg)'>

        </ThemedTextInput>
      <ThemedButton
        title={"Go to app"}
        onPress={() => router.navigate("/(tabs)/home")}
      >
        Go to Home
      </ThemedButton>
    </Screen>
  );
}

export default index

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  longText: {
    textAlign: 'justify',
    marginVertical: 20
  },
  screen : {
    marginTop: 50
  },
});