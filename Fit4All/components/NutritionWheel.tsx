import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SurfaceView } from './SurfaceView';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import { Product } from '@/types';


interface NutritionWheelProps {
  selectedDate?: Date; // Make selectedDate optional and of type Date
}

const defaultData = [
  {
    name: "Proteins",
    value: 0,
    color: "#F00",
    legendFontColor: "#e07a5f",
    legendFontSize: 15
  },
  {
    name: "Fat",
    value: 0,
    color: "#0F0",
    legendFontColor: "#81b29a",
    legendFontSize: 15
  },
  {
    name: "Carbos",
    value: 0,
    color: "#00F",
    legendFontColor: "#3d405b",
    legendFontSize: 15
  }
];

function sumDataValues(data: any[]) {
  return data.reduce((sum, item) => sum + item.value, 0);
}

export function NutritionWheel({ selectedDate }: NutritionWheelProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [chartData, setChartData] = useState(defaultData);

  const fetchNutrientData = async () => {
    try {
      const storedFoodsString = await AsyncStorage.getItem('storedProducts');
      if (storedFoodsString) {
        const storedFoods: Product[] = JSON.parse(storedFoodsString);

        // Use provided selectedDate or default to today's date
        const dateToUse = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        const nutrientTotals = {
          proteins: 0,
          fat: 0,
          carbohydrates: 0
        };

        storedFoods.forEach(product => {
          // Filter by the selected or default date
          if (product.dateAdded === dateToUse && product.nutriments) {
            nutrientTotals.proteins += parseFloat(product.nutriments.proteins_100g || '0');
            nutrientTotals.fat += parseFloat(product.nutriments.fat_100g || '0');
            nutrientTotals.carbohydrates += parseFloat(product.nutriments.carbohydrates_100g || '0');
          }
        });

        const newData = [
          {
            name: "Proteins",
            value: Math.round(nutrientTotals.proteins * 100) / 100,
            color: "#81b29a",
            legendFontColor: "#7f7f7f",
            legendFontSize: 15,
          },
          {
            name: "Fat",
            value: Math.round(nutrientTotals.fat * 100) / 100,
            color: "#e07a5f",
            legendFontColor: "#7f7f7f",
            legendFontSize: 15,
          },
          {
            name: "Carbos",
            value: Math.round(nutrientTotals.carbohydrates * 100) / 100,
            color: "#977390",
            legendFontColor: "#7f7f7f",
            legendFontSize: 15,
          },
        ];

        setChartData(newData);
      }
    } catch (error) {
      console.error('Failed to fetch nutrient data', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNutrientData();
    }, [selectedDate]) // Depend on selectedDate to refetch when it changes
  );

  const totalValue = sumDataValues(chartData);

  return (
    <SurfaceView style={styles.view} type='modal'>
      {totalValue > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={{
            color: (opacity) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 10
          }}
          accessor={"value"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          absolute
        />
      ) : (
        <View style={styles.noDataContainer}>
          <ThemedText style={styles.noDataText}>
            No data to show.{"\n"}Add food to your log to display nutrients values
          </ThemedText>
          <ThemedButton title='Add Food' style={styles.noDataButton} onPress={() => {router.navigate('/food/search')}}/>
        </View>
      )}
    </SurfaceView>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 0,
    borderWidth: 1,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  noDataText: {
    textAlign: 'center',
  },
  noDataButton: {
    marginTop: 20
  }
});

export default NutritionWheel;
