import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SurfaceView } from './SurfaceView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import ThemedTextInput from './ThemedTextInput';
import { useFocusEffect } from '@react-navigation/native';
import { store } from 'expo-router/build/global-state/router-store';
import { LineGraph } from 'react-native-graph';
import { center } from '@shopify/react-native-skia';

const screenWidth = Dimensions.get("window").width;

interface WeightData {
  value: number;
  date: Date; // Use ISO date string
}

const WeightTrackerChart = () => {
  const [data, setData] = useState<WeightData[]>([{ value: 0, date: new Date}]);
  const [loading, setLoading] = useState<boolean>(true);
  const [noData, setNoData] = useState<boolean>(false);
  const [newWeight, setNewWeight] = useState<string>(''); // State for the new weight input
  const [inputError, setInputError] = useState<boolean>(false); // State to track input error
  
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedData = await AsyncStorage.getItem('weights');
          if (storedData) {
            const weights: WeightData[] = JSON.parse(storedData, (key, value) => {
              // If the key is 'date', parse it as a Date object
              if (key === 'date') {
                return new Date(value);
              }
              return value; // otherwise, return the value as is
            });
            if (weights.length > 0) {
              setNoData(false);
              setData(weights);
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

      //fetchData();
      setData([
        { value: 10, date: new Date('2024-01-01T00:40:19.057Z') },
        { value: 15, date: new Date('2024-02-01T00:40:19.057Z') },
        { value: 20, date: new Date('2024-03-01T00:40:19.057Z') },
        { value: 25, date: new Date('2024-04-01T00:40:19.057Z') },
        { value: 30, date: new Date('2024-05-39T00:40:19.057Z') },
        { value: 35, date: new Date('2024-06-01T00:40:19.057Z') },
        { value: 40, date: new Date('2024-07-01T00:40:19.057Z') },
        { value: 45, date: new Date('2024-08-01T00:40:19.057Z') },
        { value: 80, date: new Date('2024-08-21T00:40:19.057Z') },
        { value: 50, date: new Date('2024-08-21T23:40:19.057') },
        { value: 55, date: new Date('2024-10-01T00:40:19.057Z') },
      ])
      console.log(data)
    }, [])
  );

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const storedData = await AsyncStorage.getItem('weights');
    //     if (storedData) {
    //       // Parsing the stored data
    //       const weights: WeightData[] = JSON.parse(storedData, (key, value) => {
    //         // If the key is 'date', parse it as a Date object
    //         if (key === 'date') {
    //           return new Date(value);
    //         }
    //         return value; // otherwise, return the value as is
    //       });
    
    //       if (weights.length > 0) {
    //         setNoData(false);
    //         const chartData = prepareChartData(weights);
    //         setData(weights);
    //         // weights.forEach((item, index) => {
    //         //   console.log(`Item ${index}:`, {
    //         //     weightType: typeof item.weight,
    //         //     dateType: typeof item.date,
    //         //   });
    //         // });
    //       } else {
    //         setNoData(true);
    //       }
    //     } else {
    //       setNoData(true);
    //     }
    //   } catch (error) {
    //     console.error('Failed to load weights', error);
    //     setNoData(true);
    //   }
    //   setLoading(false);
    // };
    
    
    setData([
      { value: 10, date: new Date('2024-01-01T00:40:19.057Z') },
      { value: 15, date: new Date('2024-02-01T00:40:19.057Z') },
      { value: 20, date: new Date('2024-03-01T00:40:19.057Z') },
      { value: 25, date: new Date('2024-04-01T00:40:19.057Z') },
      { value: 30, date: new Date('2024-05-39T00:40:19.057Z') },
      { value: 35, date: new Date('2024-06-01T00:40:19.057Z') },
      { value: 40, date: new Date('2024-07-01T00:40:19.057Z') },
      { value: 45, date: new Date('2024-08-01T00:40:19.057Z') },
      { value: 80, date: new Date('2024-08-21T00:40:19.057Z') },
      { value: 50, date: new Date('2024-08-21T23:40:19.057Z') },
      { value: 55, date: new Date('2024-10-01T00:40:19.057Z') },
    ])
    console.log(data)
    setLoading(false)
  }, []);


  const handleAddWeight = async () => {
    if (!newWeight || isNaN(Number(newWeight))) {
      setInputError(true);
      Alert.alert('Invalid Input', 'Please enter a valid weight.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('weights');
      const weights: WeightData[] = storedData ? JSON.parse(storedData) : [];
      const newWeightEntry: WeightData = {
        value: parseFloat(newWeight),
        date: new Date()
      };

      weights.push(newWeightEntry);
      await AsyncStorage.setItem('weights', JSON.stringify(weights));

      // Clear input field and reset error state
      setNewWeight('');
      setInputError(false);

      // Refresh chart data
      setData(weights);
      setNoData(weights.length === 0);
    } catch (error) {
      console.error('Failed to save weight', error);
    }
  };

  const handleWeightInputChange = (text: string) => {
    // Remove non-numeric characters
    const filteredText = text.replace(/[^0-9.]/g, '');
    setNewWeight(filteredText);
    setInputError(false); // Reset the error state when the user modifies the input
  };

  if (loading) {
    return (
      <SurfaceView type='modal' style={styles.container}>
        <ThemedText>Loading...</ThemedText>
        <ThemedButton title="Add weight" onPress={handleAddWeight} />
      </SurfaceView>
    );
  }

  const handleTitle = () => {
    return <ThemedText>Title goes here</ThemedText>
  }

  return (
    // <SurfaceView type='modal' style={styles.container}>
    //   {noData ? (
    //     <ThemedText>No weight history added</ThemedText>
    //   ) : (
    //     // <>
    //     //   <LineChart
    //     //     data={data}
    //     //     width={screenWidth - 40}
    //     //     height={220}
    //     //     chartConfig={{
    //     //       color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
    //     //       strokeWidth: 2,
    //     //       barPercentage: 0.5,
    //     //       useShadowColorFromDataset: false
    //     //     }}
    //     //     bezier
    //     //   />
    //     // </>
    //     <SurfaceView style={styles.graphContainer}>
    //     <LineGraph
    //       points={ [
    //         { value: 10, date: new Date('2024-01-01T00:40:19.057Z') },
    //         { value: 15, date: new Date('2024-02-01T00:40:19.057Z') },
    //         { value: 20, date: new Date('2024-03-01T00:40:19.057Z') },
    //         { value: 25, date: new Date('2024-04-01T00:40:19.057Z') },
    //         { value: 30, date: new Date('2024-05-39T00:40:19.057Z') },
    //         { value: 35, date: new Date('2024-06-01T00:40:19.057Z') },
    //         { value: 40, date: new Date('2024-07-01T00:40:19.057Z') },
    //         { value: 45, date: new Date('2024-08-01T00:40:19.057Z') },
    //         { value: 80, date: new Date('2024-08-21T00:40:19.057Z') },
    //         { value: 50, date: new Date('2024-08-21T23:40:19.057') },
    //         { value: 55, date: new Date('2024-10-01T00:40:19.057Z') },
    //       ] }
    //       animated={false}
    //       color="#a86f6f"
    //       style={styles.lineGraph}
    //     />
    //   </SurfaceView>
    //   )}
    //   <View style={styles.addWeightContainer}>
    //     <ThemedTextInput
    //       style={[styles.textInput, inputError && styles.inputError]}
    //       placeholder="Enter weight"
    //       keyboardType="numeric"
    //       value={newWeight}
    //       onChangeText={handleWeightInputChange}
    //     />
    //     <ThemedButton title="Add weight" type='primary' onPress={handleAddWeight} />
    //   </View>
    // </SurfaceView>
    <SurfaceView type="modal">
      {handleTitle()}
      <SurfaceView style={styles.graphContainer}>
        <LineGraph
          points={data}
          animated={false}
          color="#a86f6f"
          style={styles.lineGraph}
        />
      </SurfaceView>
      <View style={styles.addWeightContainer}>
        <ThemedTextInput
          style={[styles.textInput, inputError && styles.inputError]}
          placeholder="Enter weight"
          keyboardType="numeric"
          value={newWeight}
          onChangeText={handleWeightInputChange}
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
    // alignItems: 'center',
    flex: 1
  },
  addWeightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  inputError: {
    borderColor: 'red',
  },
  lineGraph: {
    flex: 1, // Make the LineGraph fill its container
  },
  graphContainer: {
    height: 250, // Set a height for the graph container
    marginVertical: 0, // Add some vertical margin
  },
});

export default WeightTrackerChart;
