import React, { useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Nutriments {
  energy_100g?: string;
  fat_100g?: string;
  proteins_100g?: string;
  carbohydrates_100g?: string;
}

interface Product {
  id: string;
  key?: string;
  product_name: string;
  nutriments: Nutriments;
  dateAdded?: string;
  amount: string;
}

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

  const handleInputChange = (
    text: string,
    setState: (value: string) => void
  ) => {
    // Replace anything that isn't a digit or decimal separator
    const cleanedText = text.replace(/[^0-9.]/g, "");
    setState(cleanedText);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          headerTitle: "Add Product",
          headerTintColor: textColor, // Use the dynamic theme-based color for header elements
          headerTitleStyle: {
            color: textColor, // Apply theme-based color to the header title
          },
        }}
      />
      <ThemedText style={{ marginVertical: 8 }}>Product name: </ThemedText>
      <ThemedTextInput
        value={productName}
        onChangeText={(text) => {
          setProductName(text);
          setIsNameValid(true); // Reset border color when typing
        }}
        style={[
          styles.input,
          isError.name ? styles.invalidInput : null, // Apply red border if name is invalid
        ]}
      />
      <ThemedText style={{ marginVertical: 8 }}>Energy per 100g(g):</ThemedText>
      <ThemedTextInput
        value={energy}
        onChangeText={(text) => handleInputChange(text, setEnergy)}
        inputMode="decimal"
        style={styles.input}
      />
      <ThemedText style={{ marginVertical: 8 }}>Fat per 100g(g):</ThemedText>
      <ThemedTextInput
        value={fat}
        onChangeText={(text) => handleInputChange(text, setFat)}
        inputMode="decimal"
        style={styles.input}
      />
      <ThemedText style={{ marginVertical: 8 }}>Proteins per 100g(g):</ThemedText>
      <ThemedTextInput
        value={proteins}
        onChangeText={(text) => handleInputChange(text, setProteins)}
        inputMode="decimal"
        style={styles.input}
      />
      <ThemedText style={{ marginVertical: 8 }}>Carbohydrates per 100g(g):</ThemedText>
      <ThemedTextInput
        value={carbohydrates}
        onChangeText={(text) => handleInputChange(text, setCarbohydrates)}
        inputMode="decimal"
        style={styles.input}
      />
      <ThemedText style={{ marginVertical: 8 }}>Enter product amount(g):</ThemedText>
      <ThemedTextInput
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setIsError({
            name: isError.name,
            amount: false,
          });
        }}
        style={[
          styles.input,
          isError.amount ? styles.invalidInput : null, // Apply red border if name is invalid
        ]}
      />
      <ThemedButton title="Save" onPress={saveToStorage} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
  },
  invalidInput: {
    borderColor: "red",
  },
});

export default CreateScreen;
