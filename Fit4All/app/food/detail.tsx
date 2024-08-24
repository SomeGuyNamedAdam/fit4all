import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import ThemedButton from '@/components/ThemedButton';

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
  const [energyUnit, setEnergyUnit] = useState(4.184);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');

  const getUnits = async () => {
    try {
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      if (energyUnitString) {
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    const fetchData = async () => {
      try {
        await getUnits();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    loadProduct();
  }, []);

  const saveToStorage = async () => {
    if (amount === '' || parseInt(amount) <= 0) {
      Alert.alert('Insert proper value. Value must be higher than zero');
      return;
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
        router.navigate('/food');
      } catch (error) {
        console.error('Failed to save the product', error);
      }
    }
  };

  if (!product || loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  const getNutrientValue = (value: string | undefined, unit: string = 'g') => {
    return value ? `${value} ${unit}` : 'No data';
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          headerTitle: 'Add Exercise',
          headerTintColor: textColor, // Use the dynamic theme-based color for header elements
          headerTitleStyle: {
            color: textColor, // Apply theme-based color to the header title
          },
        }}
      />
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{product.product_name}</ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>
        Energy per 100g: {product.nutriments.energy_100g ? `${(parseFloat(product.nutriments.energy_100g) / energyUnit).toFixed(0)} ${energyUnit === 1 ? 'kj' : 'kcal'}` : 'No data'} 
      </ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>
        Fat: {getNutrientValue(product.nutriments.fat_100g)}
      </ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>
        Proteins: {getNutrientValue(product.nutriments.proteins_100g)}
      </ThemedText>
      <ThemedText style={{ marginVertical: 8 }}>
        Carbohydrates: {getNutrientValue(product.nutriments.carbohydrates_100g)}
      </ThemedText>
      <ThemedTextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount (g)"
        inputMode="numeric"
        style={{ borderWidth: 1, padding: 8, marginVertical: 16 }}
      />
      <ThemedButton title="Save" onPress={saveToStorage} />
    </View>
  );
};

export default DetailScreen;
