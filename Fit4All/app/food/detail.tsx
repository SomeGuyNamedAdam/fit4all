import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';

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
  dateAdded?: string; // Add this field to store the date
}

const generateUniqueKey = (productId: string): string => {
  return `${productId}-${new Date().getTime()}`;
};

const DetailScreen = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [amount, setAmount] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const storedProduct = await AsyncStorage.getItem('currentFood');
        if (storedProduct) {
          setProduct(JSON.parse(storedProduct));
        }
      } catch (error) {
        console.error('Failed to load the product', error);
      }
    };

    loadProduct();
  }, []);

  const convertKJToKcal = (kJ: string | undefined): string => {
    if (!kJ) return '0';
    const energyKJ = parseFloat(kJ);
    const energyKcal = energyKJ;
    return energyKcal.toFixed(1);
  };

  const saveToStorage = async () => {
    if (amount == '' || parseInt(amount) <= 0){
      Alert.alert('Insert proper value. Value must be higher than zero')
      return
    }
    if (product) {
      try {
        const storedItemsString = await AsyncStorage.getItem('storedProducts');
        const storedItems = storedItemsString ? JSON.parse(storedItemsString) : [];

        // Generate a unique key for the product
        const uniqueKey = generateUniqueKey(product.id);

        // Add the product with the unique key, amount, and current date
        const currentDate = new Date().toISOString().split('T')[0];
        storedItems.push({ ...product, key: uniqueKey, amount, dateAdded: currentDate });
        await AsyncStorage.setItem('storedProducts', JSON.stringify(storedItems));
        Alert.alert('Product saved!');
        router.back(); // Navigate back to the previous screen
      } catch (error) {
        console.error('Failed to save the product', error);
      }
    }
  };

  if (!product) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{headerTitle: `Add`}} />
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{product.product_name}</ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>Calories: {product.nutriments.energy_100g} kJ</ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>Fat: {product.nutriments.fat_100g} g</ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>Proteins: {product.nutriments.proteins_100g} g</ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>Carbohydrates: {product.nutriments.carbohydrates_100g} g</ThemedText>
      <ThemedTextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        inputMode="numeric"
        style={{ borderWidth: 1, padding: 8, marginVertical: 16 }}
      />
      <Button title="Save" onPress={saveToStorage} />
    </View>
  );
};

export default DetailScreen;
