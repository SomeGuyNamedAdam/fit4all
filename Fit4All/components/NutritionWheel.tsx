import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from './ThemedText';
import { SurfaceView } from './SurfaceView';
import { setStatusBarHidden } from 'expo-status-bar';

interface Product {
  id: string;
  product_name: string;
  nutriments: {
    energy_100g?: string;
    fat_100g?: string;
    proteins_100g?: string;
    carbohydrates_100g?: string;
  };
  energy?: string;
}

const defaultData = [
  {
    name: "Proteins",
    value: 0,
    color: "#F00",
    legendFontColor: "#e07a5f",
    legendFontSize: 15
  },{
    name: "Fat",
    value: 0,
    color: "#0F0",
    legendFontColor: "#81b29a",
    legendFontSize: 15
  },{
    name: "Carbohydrates",
    value: 0,
    color: "#00F",
    legendFontColor: "#3d405b",
    legendFontSize: 15
  }
];

function sumDataValues(data: any[]) {
  return data.reduce((sum, item) => sum + item.value, 0);
}

export function NutritionWheel() {
  const { width: screenWidth } = useWindowDimensions();
  const [chartData, setChartData] = useState(defaultData);

  const fetchNutrientData = async () => {
    try {
      const storedFoodsString = await AsyncStorage.getItem('storedProducts');
      if (storedFoodsString) {
        const storedFoods: Product[] = JSON.parse(storedFoodsString);

        const nutrientTotals = {
          proteins: 0,
          fat: 0,
          carbohydrates: 0
        };

        storedFoods.forEach(product => {
          if (product.nutriments) {
            nutrientTotals.proteins += parseFloat(product.nutriments.proteins_100g || '0');
            nutrientTotals.fat += parseFloat(product.nutriments.fat_100g || '0');
            nutrientTotals.carbohydrates += parseFloat(product.nutriments.carbohydrates_100g || '0');
          }
        });

        const newData = [
          {
            name: "Proteins",
            value: nutrientTotals.proteins,
            color: "#81b29a",
            legendFontColor: "#7f7f7f",
            legendFontSize: 15
          },
          {
            name: "Fat",
            value: nutrientTotals.fat,
            color: "#e07a5f",
            legendFontColor: "#7f7f7f",
            legendFontSize: 15
          },
          {
            name: "Carbohydrates",
            value: nutrientTotals.carbohydrates,
            color: "#977390",
            legendFontColor: "#7f7f7f",
            legendFontSize: 15
          }
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
    }, [])
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
        />
      ) : (
        <View style={{ flexDirection: 'row', width: screenWidth, height: 300, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText style={{ textAlign: 'center', flex: 1 }}>No data to show.{"\n"}Add food to your log to display nutrients values</ThemedText>
        </View>
      )}
    </SurfaceView>
  );
}

export default NutritionWheel;

const styles = StyleSheet.create({
  view: {
    padding: 0,
    borderWidth: 1,
    // overflow: 'hidden'
  },
  text: {
    fontSize: 28,
  }
});
