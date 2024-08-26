import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useFont } from '@shopify/react-native-skia';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, StyleSheet, useColorScheme, View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { SurfaceView } from './SurfaceView';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import ThemedTextInput from './ThemedTextInput';
import { format, subMonths } from 'date-fns'; // Import subMonths function
import { useThemeColor } from '@/hooks/useThemeColor';
import { handleNumberInputChange } from '@/utils/inputHandler';

const screenWidth = Dimensions.get("window").width;

interface WeightData {
  value: number;
  date: Date;
}
export type WeightTrackerChartProps = {
  lightColor? : string;
  darkColor?: string
};

const WeightTrackerChart: React.FC = ({
  lightColor,
  darkColor,
}: WeightTrackerChartProps) => {
  const [data, setData] = useState<WeightData[]>([]);

  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text')
  const [loading, setLoading] = useState<boolean>(true);
  const [noData, setNoData] = useState<boolean>(true);
  const [newWeight, setNewWeight] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);

  const font = useFont(require('../assets/fonts/Roboto-Medium.ttf'), 12);

  useFocusEffect(
   
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedData = await AsyncStorage.getItem('weights');
          if (storedData) {
            const weights: WeightData[] = JSON.parse(storedData, (key, value) => {
              if (key === 'date') {
                return new Date(value);
              }
              if (key === 'value' || key === 'weight') {
                return Number(value);
              }
              return value;
            });

            if (weights.length > 0) {
              // Determine the oldest date in the data
              const oldestDate = weights.reduce((earliest, current) => {
                return current.date < earliest ? current.date : earliest;
              }, weights[0].date);

              // Add an item that's 3 months older than the oldest item
              const olderEntry: WeightData = {
                value: weights[0].value, // You can set this to whatever value you prefer
                date: subMonths(oldestDate, 3),
              };

              const updatedWeights = [olderEntry, ...weights];
              setData(updatedWeights);
              setNoData(false);
            } else {
              setNoData(true);
            }
          } else {
            setNoData(true);
          }
        } catch (error) {
          console.error('Failed to load weights', error);
          setNoData(true);
        }
      };

      fetchData().finally(() => setLoading(false));
    }, [])
  );

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      setInputError(true);
      Alert.alert('Invalid Input', 'Please enter a valid weight.');
      return;
    }

    // if (weights.length > 0) {
    //   // Determine the oldest date in the data
    //   const oldestDate = weights.reduce((earliest, current) => {
    //     return current.date < earliest ? current.date : earliest;
    //   }, weights[0].date);

    //   // Add an item that's 3 months older than the oldest item
    //   const olderEntry: WeightData = {
    //     value: weights[0].value, // You can set this to whatever value you prefer
    //     date: subMonths(oldestDate, 3),
    //   };

    try {
      const newWeightEntry: WeightData = {
        value: parseFloat(newWeight),
        date: new Date()
      };
      let updatedWeights = noData ? [newWeightEntry] : [...data, newWeightEntry];
      await AsyncStorage.setItem('weights', JSON.stringify(updatedWeights));

      setNewWeight('');
      setInputError(false);

      const oldestDate = updatedWeights.reduce((earliest, current) => {
        return current.date < earliest ? current.date : earliest;
      }, updatedWeights[0].date);

      // Add an item that's 3 months older than the oldest item
      const olderEntry: WeightData = {
        value: updatedWeights[0].value, // You can set this to whatever value you prefer
        date: subMonths(oldestDate, 3),
      };
      updatedWeights = [olderEntry, ...updatedWeights]
    
      setData(updatedWeights);
      setNoData(updatedWeights.length === 0);
    } catch (error) {
      console.error('Failed to save weight', error);
    }
  };
  // Transform data for chart
  const chartData = data.map(entry => ({
    x: new Date(entry.date).getTime(), // Convert date to timestamp
    y: entry.value
  }));

  // Calculate xDomain from today to 3 months back
  const today = new Date();
  const threeMonthsAgo = subMonths(today, 3);

  const xDomain: [number, number] = [
    threeMonthsAgo.getTime(),
    today.getTime()
  ];

  // Calculate yDomain with default values
  const yDomain: [number, number] = [
    Math.min(...chartData.map(d => d.y)),
    Math.max(...chartData.map(d => d.y))
  ];

  // Format date for x-axis labels
  const formatXLabel = (timestamp: number) => {
    return format(new Date(timestamp), 'dd/MM'); // Format as "dd/MM"
  };

  if (loading) {
    return (
      <SurfaceView type='modal' style={styles.container}>
        <ThemedText>Loading...</ThemedText>
        {/* <ThemedButton title="Add weight" onPress={(handleAddWeight)} /> */}
      </SurfaceView>
    );
  }

  return (
    <SurfaceView type="modal" style={styles.container}>
      {noData === true ? (
        <View style={styles.chartContainer}>
        <ThemedText style={styles.noDataText}>No data to show</ThemedText>
        </View>) : (
      <View style={[{ height: 300 }]}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["y"]}
          axisOptions={{
            font,
            formatXLabel,
            tickCount: { x: 3, y: 5 }, // Set tick count for x-axis to 3
            labelOffset: { x: 10, y: 10 }, // Adjust label offset
            lineColor : {
              grid : {
                x : color,
                y : color,
              },
              frame: color
            },
            labelColor : color
          }}
          domain={{ x: xDomain, y: yDomain }}
          domainPadding={{ left: 20, right: 20,  top: 20, bottom: 20 }}
        >
          {({ points }) => (
            <Line points={points.y} color="#04dac6" strokeWidth={3} />
          )}
        </CartesianChart>
        
      </View>
)}
      <View style={styles.addWeightContainer}>
        <ThemedTextInput
          style={[styles.textInput, inputError && styles.inputError]}
          placeholder="Enter weight"
          keyboardType="numeric"
          value={newWeight}
          onChangeText={(text) => {handleNumberInputChange(text, setNewWeight)}}
        />
        <ThemedButton
          title="Add weight"
          type="primary"
          onPress={handleAddWeight}
        />
      </View>
    </SurfaceView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  addWeightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16, // Adjust font size as needed
    color: '#000', // Adjust color as needed
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: 150,
  },
  inputError: {
    borderColor: 'red',
  },
  chartContainer: {
    flex: 1, // Use flex to take up the available space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
});

export default WeightTrackerChart;
