import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import { useThemeColor } from "@/hooks/useThemeColor";
import { handleNumberInputChange } from "@/utils/inputHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Product } from "@/types";
import { ThemedView } from "@/components/ThemedView";
import Screen from "@/components/Screen"


const generateUniqueKey = (): string => {
  return `${new Date().getTime()}`;
};

const CreateScreen = () => {
  const [productName, setProductName] = useState("");
  const [energy, setEnergy] = useState("");
  const [fat, setFat] = useState("");
  const [proteins, setProteins] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [amount, setAmount] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [isError, setIsError] = useState<{ name: boolean; amount: boolean }>({
    name: false,
    amount: false,
  });
  const router = useRouter();
  const textColor = useThemeColor({}, "text");

  const validateInputs = () => {
    setIsError({
      name: !productName,
      amount: !amount,
    });
  };

  const saveToStorage = async () => {
    validateInputs();
    if (!isError.name && !isError.amount && productName && amount) {
      try {
        const storedItemsString = await AsyncStorage.getItem("storedProducts");
        const userProductsString = await AsyncStorage.getItem("userProducts")
        const storedItems = storedItemsString
          ? JSON.parse(storedItemsString)
          : [];
        const userProducts = userProductsString ? JSON.parse(userProductsString) : []
        // Generate a unique key for the product
        const uniqueKey = generateUniqueKey();

        // Create product object
        const newProduct: Product = {
          id: uniqueKey,
          key: generateUniqueKey(),
          product_name: productName,
          nutriments: {
            energy_100g: energy ? energy : undefined,
            fat_100g: fat ? fat : undefined,
            proteins_100g: proteins ? proteins : undefined,
            carbohydrates_100g: carbohydrates ? carbohydrates : undefined,
          },
          dateAdded: new Date().toISOString().split("T")[0],
          amount: amount,
        };
        // Add the product to storage
        storedItems.push(newProduct);
        userProducts.push(newProduct)
        await AsyncStorage.setItem(
          "storedProducts",
          JSON.stringify(storedItems)
        );
        await AsyncStorage.setItem('userProducts', JSON.stringify(userProducts))

        Alert.alert("Product saved!");
        router.navigate("/food");
      } catch (error) {
        console.error("Failed to save the product", error);
      }
    } else {
      alert("Please fill out all fields");
    }
  };

  return (
    <Screen type='scroll' style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          headerTitle: "Create Product",
          headerTintColor: textColor, // Use the dynamic theme-based color for header elements
          headerTitleStyle: {
            color: textColor, // Apply theme-based color to the header title
          },
        }}
      />
      
      <ThemedTextInput
        value={productName}
        onChangeText={(text) => {
          setProductName(text);
          setIsNameValid(true); // Reset border color when typing
        }}
        label="Product name: "
        style={[
          styles.input,
          isError.name ? styles.invalidInput : null, // Apply red border if name is invalid
        ]}
      />
      <ThemedTextInput
        value={energy}
        onChangeText={(text) => handleNumberInputChange(text, setEnergy)}
        inputMode="decimal"
        style={styles.input}
        label="Energy per 100g:"
      />
      <ThemedTextInput
        value={fat}
        onChangeText={(text) => handleNumberInputChange(text, setFat)}
        inputMode="decimal"
        style={styles.input}
        label="Fat per 100g:"
      />
      <ThemedTextInput
        value={proteins}
        onChangeText={(text) => handleNumberInputChange(text, setProteins)}
        inputMode="decimal"
        style={styles.input}
        label="Proteins per 100g:"
      />
      <ThemedTextInput
        value={carbohydrates}
        onChangeText={(text) => handleNumberInputChange(text, setCarbohydrates)}
        inputMode="decimal"
        style={styles.input}
        label="Carbohydrates per 100g:"
      />
      <ThemedTextInput
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setIsError({
            name: isError.name,
            amount: false,
          });
        
        }}
        label="Product amount(g):"
        style={[
          styles.input,
          isError.amount ? styles.invalidInput : null, // Apply red border if name is invalid
        ]}
      />
      <ThemedButton title="Save" onPress={saveToStorage} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  input: {
  },
  invalidInput: {
    borderColor: "red",
  },
});

export default CreateScreen;
