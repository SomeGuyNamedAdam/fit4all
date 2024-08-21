import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SurfaceView } from './SurfaceView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';
import ThemedTextInput from './ThemedTextInput';
import { center } from '@shopify/react-native-skia';

const screenWidth = Dimensions.get("window").width;

interface WeightData {
  weight: number;
  date: string; // Use ISO date string
}

const WeightTrackerChart = () => {
  const [data, setData] = useState<{ labels: string[], datasets: any[], legend: string[] }>({
    labels: [],
    datasets: [],
    legend: []
  });
  const [range, setRange] = useState<'week' | 'month' | 'year' | 'full'>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [noData, setNoData] = useState<boolean>(false);
  const [newWeight, setNewWeight] = useState<string>(''); // State for the new weight input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('weights');
        if (storedData) {
          const weights: WeightData[] = JSON.parse(storedData);
          const filteredData = filterDataByRange(weights, range);
          if (filteredData.length > 0) {
            setNoData(false);
            const chartData = prepareChartData(filteredData);
            setData(chartData);
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
      setLoading(false);
    };

    fetchData();
  }, [range]);

  const filterDataByRange = (weights: WeightData[], range: 'week' | 'month' | 'year' | 'full') => {
    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'full':
      default:
        return weights;
    }

    return weights.filter(weight => new Date(weight.date) >= startDate);
  };

  const prepareChartData = (weights: WeightData[]) => {
    const dataset = weights.map(weight => weight.weight);
    let labels: string[] = [];

    const getMonthName = (date: Date) => date.toLocaleString('default', { month: 'short' });
    const getYear = (date: Date) => date.getFullYear().toString();

    switch (range) {
      case 'week':
        // No labels for the week range
        break;
      case 'month':
        // Add labels for each week of the current month
        const startOfMonth = new Date(new Date().setDate(1));
        for (let week = 1; week <= 4; week++) {
          labels.push(`Week ${week}`);
        }
        break;
      case 'year':
        // Add labels for every 3 months
        const startOfYear = new Date(new Date().setMonth(0, 1)); // January 1st
        for (let m = startOfYear; m <= new Date(); m.setMonth(m.getMonth() + 3)) {
          labels.push(getMonthName(m) + ' ' + getYear(m));
        }
        break;
      case 'full':
        // Add labels for each year
        const startOfDecade = new Date(new Date().setFullYear(Math.floor(new Date().getFullYear() / 10) * 10));
        for (let y = startOfDecade; y <= new Date(); y.setFullYear(y.getFullYear() + 1)) {
          labels.push(getYear(y));
        }
        break;
      default:
        break;
    }

    return {
      labels,
      datasets: [{
        data: dataset,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }],
      legend: ['Weight Tracker']
    };
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      alert('Please enter a valid weight.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('weights');
      const weights: WeightData[] = storedData ? JSON.parse(storedData) : [];
      const newWeightEntry: WeightData = {
        weight: parseFloat(newWeight),
        date: new Date().toISOString()
      };

      weights.push(newWeightEntry);
      await AsyncStorage.setItem('weights', JSON.stringify(weights));

      // Clear input field
      setNewWeight('');

      // Refresh chart data
      const filteredData = filterDataByRange(weights, range);
      const chartData = prepareChartData(filteredData);
      setData(chartData);
      setNoData(filteredData.length === 0);
    } catch (error) {
      console.error('Failed to save weight', error);
    }
  };

  const populateSampleData = async () => {
    const weights: WeightData[] = [
      { weight: 60, date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
      { weight: 62, date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
      { weight: 65, date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString() },
      { weight: 68, date: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString() },
      { weight: 70, date: new Date(new Date().setDate(new Date().getDate() - 180)).toISOString() },
      { weight: 75, date: new Date(new Date().setDate(new Date().getDate() - 400)).toISOString() }
    ];

    await AsyncStorage.setItem('weights', JSON.stringify(weights));
    // Refresh the chart with the new data
    const filteredData = filterDataByRange(weights, range);
    const chartData = prepareChartData(filteredData);
    setData(chartData);
    setNoData(filteredData.length === 0);
  };

  useEffect(() => {
    // Call this function to populate sample data if needed
    // populateSampleData(); // Uncomment to populate data
  }, []);

  if (loading) {
    return (
      <SurfaceView type='modal' style={styles.container}>
        <ThemedText>Loading...</ThemedText>
        <ThemedButton title="Add weight" onPress={handleAddWeight} />
      </SurfaceView>
    );
  }

  return (
    <SurfaceView type='modal' style={styles.container}>
      {noData ? (
        <ThemedText>No weight history added</ThemedText>
      ) : (
        <>
          <LineChart
            data={data}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
              useShadowColorFromDataset: false
            }}
            bezier
          />
          <View style={styles.rangeContainer}>
            {['week', 'month', 'year', 'full'].map(rangeOption => (
              <TouchableOpacity
                key={rangeOption}
                style={[styles.button, range === rangeOption && styles.buttonActive]}
                onPress={() => setRange(rangeOption as 'week' | 'month' | 'year' | 'full')}
              >
                <Text style={styles.buttonText}>{rangeOption.charAt(0).toUpperCase() + rangeOption.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      <View style={styles.addWeightContainer}>
        <ThemedTextInput
          style={styles.textInput}
          placeholder="Enter weight"
          keyboardType="numeric"
          value={newWeight}
          onChangeText={setNewWeight}
        />
        <ThemedButton title="Add weight" type='primary' onPress={handleAddWeight} />
      </View>
    </SurfaceView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonActive: {
    backgroundColor: '#a3a3a3',
  },
  buttonText: {
    color: '#fff',
  },
  addWeightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: 150,
  },
});

export default WeightTrackerChart;
