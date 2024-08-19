import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Product {
  id: string;
  product_name: string;
  nutriments: {
    energy_100g?: string;
  };
  amount?: string; // Add amount field to Product interface
}

interface Workout {
  category: string;
  activity: string;
  duration: string;
  weight: string;
  caloriesBurned: number;
  date: string;
}

interface CaloriesCounterProps {
  source: 'food' | 'workout'; // source can be 'food' or 'workout'
}

export function CaloriesCounter({ source }: CaloriesCounterProps) {
  const [calories, setCalories] = React.useState(0);
  const [energyUnit, setEnergyUnit] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const getCalories = async () => {
    try {
      const key = source === 'food' ? 'storedProducts' : 'doneWorkouts';
      const storedDataString = await AsyncStorage.getItem(key);

      if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        
        let totalCalories = 0;
        if (source === 'food') {
          const storedFoods: Product[] = storedData;
          storedFoods.forEach(product => {
            const amount = parseFloat(product.amount || '0');
            const energyPer100g = parseFloat(product.nutriments?.energy_100g || '0');
            // Calculate calories using energy_100g * amount * 0.01
            totalCalories += (energyPer100g * amount * 0.01);
          });
          setCalories(Math.round(totalCalories));
        } else if (source === 'workout') {
          const doneWorkouts: Workout[] = storedData;
          doneWorkouts.forEach(workout => {
            totalCalories += workout.caloriesBurned;
          });
          setCalories((totalCalories));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUnits = async () => {
    try {
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      if ( energyUnit){
        const unit = energyUnitString === 'kj' ? 1: 4.184;
        setEnergyUnit(unit)
      }
    } catch (error) {
      
    }
  }
  const fetchData = async () => {
    try {
      getCalories();
      getUnits();
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [source])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View style={styles.view}>
      <Text style={styles.text}>
        {source === 'food' ? 'Consumed Energy' : 'Burned Energy'}: {(Math.round(calories) / energyUnit).toFixed(0)} {energyUnit === 1 ? 'kJ' : 'kcal'}🔥
      </Text>
    </View>
  );
}

export default CaloriesCounter;

const styles = StyleSheet.create({
  view: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  text: {
    fontSize: 28,
  },
});
