import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  product_name: string;
  nutriments: {
    energy_100g?: string;
  };
  amount?: string; // Amount in grams
}

export function useFoodCalories() {
  const [calories, setCalories] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0); // Total amount of food
  const [energyUnit, setEnergyUnit] = useState<number>(1); // 1 for kJ, 4.184 for kcal
  const [weightUnit, setWeightUnit] = useState<number>(1); // 1 for kg, 2.205 for lb
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading true before fetching
    try {
      const storedProductsString = await AsyncStorage.getItem('storedProducts');
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      const weightUnitString = await AsyncStorage.getItem('weightUnit');
      
      if (storedProductsString) {
        const storedProducts: Product[] = JSON.parse(storedProductsString);
        let totalCalories = 0;
        let totalGrams = 0;

        storedProducts.forEach(product => {
          const amount = parseFloat(product.amount || '0');
          const energyPer100g = parseFloat(product.nutriments?.energy_100g || '0');
          totalGrams += amount;
          totalCalories += (energyPer100g * amount * 0.01);
        });

        // Apply the current unit conversion
        setCalories(Math.round(totalCalories / energyUnit));
        setTotalAmount(totalGrams / 1000 * weightUnit); // Convert grams to kilograms or pounds
      }

      if (energyUnitString) {
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      }
      if (weightUnitString) {
        const unit = weightUnitString === 'kg' ? 1 : 2.205;
        setWeightUnit(unit);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false); // Set loading false after fetching
    }
  }, [energyUnit, weightUnit]);

  // Initial fetch and refetch when unit settings change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { calories, totalAmount, energyUnit, weightUnit, loading };
}
