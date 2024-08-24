import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native';
import Screen from '@/components/Screen';
import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

const about = () => {
  const textColor = useThemeColor({}, 'text');
  return (
    <Screen type='scroll' style={styles.container}>
      <Stack.Screen
      options={{
        headerTitle: 'About',
        headerTintColor: textColor, // Use the dynamic theme-based color for header elements
        headerTitleStyle: {
          color: textColor, // Apply theme-based color to the header title
        },
      }}
    />
      <ThemedText type='default'>Created by Adam Lenardt</ThemedText>
      <ThemedText type='title'>Privacy Policy</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>1. Introduction</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}Thank you for choosing [Your App Name]. We value your privacy and are committed to safeguarding your personal information. This Privacy Policy explains how we collect, use, and protect your data.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>2. Data Collection</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}Our app collects and stores the following types of personal information, which you input yourself:</ThemedText>
      <View style={styles.listContainer}>
        <View style={styles.listItem}>
          <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}{`\u2022 Weight Data: Information related to your body weight.`}</ThemedText>
        </View>
        <View style={styles.listItem}>
          <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}{`\u2022 Meal Data: Information about your meals, including food items and nutritional details.`}</ThemedText>
        </View>
        <View style={styles.listItem}>
          <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}{`\u2022 Exercise Data: Information about your physical activities and exercises.`}</ThemedText>
        </View>
      </View>
      <ThemedText type='subtitle' style={styles.subtitle}>3. Data Storage</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}All data collected by the app is stored locally on your device. We do not transmit, store, or share your data with any external servers, third-party services, or cloud providers.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>4. Data Usage</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}The data you provide is used solely for the functionality of the app to help you track and manage your weight, meals, and exercises. We do not have access to this data, and it is not used by us or any third-party entities for any purpose.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>5. Integration with OpenFoodFacts API</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}To provide nutritional information about food items, our app connects to the OpenFoodFacts API. This API allows us to retrieve data on the nutritional content of various food products. However, we do not share your personal data with OpenFoodFacts or any other third-party services. The interaction with the OpenFoodFacts API is solely for retrieving the necessary nutrient data to enhance your experience with the app.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>6. Data Sharing</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}Since your data is stored locally on your device, it is not shared with anyone. We do not sell, trade, or otherwise transfer your personal data to outside parties.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>7. Data Deletion</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}You have full control over your data. You can delete any or all of your data at any time directly within the app. Once deleted, the data is permanently removed from your device and cannot be recovered.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>8. Security</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}We take reasonable precautions to protect your data stored on your device. However, the security of your device and the data stored on it is also dependent on your own measures, such as using device encryption and maintaining updated software.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>9. Changes to This Privacy Policy</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}We may update this Privacy Policy from time to time. If there are significant changes, we will notify you through the app. Your continued use of the app after any changes indicates your acceptance of the updated policy.</ThemedText>
      <ThemedText type='subtitle' style={styles.subtitle}>10. Contact Us</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}If you have any questions or concerns about this Privacy Policy or your data, please contact us at agrestjam@gmail.com.</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}Fit4All</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}AgrestJam</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}agrestjam@gmail.com</ThemedText>
      <ThemedText style={styles.text}>{'\u00A0'.repeat(4)}Adam Lenardt</ThemedText>
    </Screen>
  )
}

export default about;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
    marginBottom: 50
  },
  listContainer: {
    paddingVertical: 20,
  },
  listItem: {
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 10
  },
  text : {
    textAlign: 'justify'
  }
});
