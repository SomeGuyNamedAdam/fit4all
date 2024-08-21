import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SurfaceView } from './SurfaceView';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';
import { router } from 'expo-router';

interface Product {
  id: string;
  product_name: string;
  nutriments: {
    energy_100g?: string;
  };
  amount?: string;
}

export function FoodCalories() {
  const { colors } = useTheme();

  const [calories, setCalories] = useState(0);
  const [energyUnit, setEnergyUnit] = useState(1);
  const [loading, setLoading] = useState(true);

  const getCalories = async () => {
    try {
      const storedDataString = await AsyncStorage.getItem('storedProducts');
      if (storedDataString) {
        const storedFoods: Product[] = JSON.parse(storedDataString);
        
        let totalCalories = 0;
        storedFoods.forEach(product => {
          const amount = parseFloat(product.amount || '0');
          const energyPer100g = parseFloat(product.nutriments?.energy_100g || '0');
          totalCalories += (energyPer100g * amount * 0.01);
        });

        setCalories(Math.round(totalCalories));
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await getCalories();
          await getUnits();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SurfaceView type="modal" style={styles.view}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>Food</ThemedText>
        <ThemedButton style={styles.button} title="+" type="primary" onPress={() => { router.push('/food/search'); }} />
      </View>
      <ThemedText style={styles.text}>
      🍏: {(Math.round(calories) / energyUnit).toFixed(0)} {energyUnit === 1 ? 'kJ' : 'kcal'}
      </ThemedText>
    </SurfaceView>
  );
}

export default FoodCalories;

const styles = StyleSheet.create({
  view: {
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 28,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  totalTime: {
    fontSize: 20,
    marginTop: 10,
  },
});
