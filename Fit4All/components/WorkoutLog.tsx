import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface Workout {
  id: string;
  key: string;
  category: string;
  activity: string;
  duration: string;
  weight: string;
  caloriesBurned: number;
  dateAdded: string;
}

const WorkoutLog = () => {
  const [workoutLogs, setWorkoutLogs] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [energyUnit, setEnergyUnit] = useState(1)
  const [weightUnit, setWeightUnit] = useState(1)

  const fetchWorkoutLogs = async () => {
    try {
      const storedWorkoutsString = await AsyncStorage.getItem('doneWorkouts');
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      const weightUnitString = await AsyncStorage.getItem('weightUnit');
      if (storedWorkoutsString) {
        const storedWorkouts = JSON.parse(storedWorkoutsString);
        setWorkoutLogs(storedWorkouts);
      }
      if (energyUnit){
        const unit = energyUnitString === 'kj' ? 1 : 4.184
        setEnergyUnit(unit)
      }
      if(weightUnit){
        const unit = weightUnitString === 'lbs' ? 1 : 2.205
        setWeightUnit(unit)
      }
    } catch (error) {
      console.error('Failed to fetch workout logs', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutLogs();
    }, [])
  );

  const handlePress = (item: Workout) => {
    // router.push(`/workout/detail?id=${item.id}`);
  };

  const clearWorkoutLogs = async () => {
    try {
      await AsyncStorage.removeItem('doneWorkouts');
      setWorkoutLogs([]);
    } catch (error) {
      console.error('Failed to clear workout logs', error);
    }
  };

  const deleteItem = async (key: string) => {
    try {
      const updatedWorkouts = workoutLogs.filter(workout => workout.key !== key);
      await AsyncStorage.setItem('doneWorkouts', JSON.stringify(updatedWorkouts));
      setWorkoutLogs(updatedWorkouts);
    } catch (error) {
      console.error('Failed to delete the item', error);
    }
  };

  const handleDelete = (item: Workout) => {
    if (Platform.OS === 'web') {
      deleteItem(item.key);
    } else {
      confirmDelete(item);
    }
  };

  const confirmDelete = (item: Workout) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete this workout log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => deleteItem(item.key) },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, padding: 0 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Workout Logs</Text>
      <Button title="Clear All Logs" onPress={clearWorkoutLogs} color="#FF6347" />
      {workoutLogs.length === 0 ? (
        <Text>No workout logs available.</Text>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={workoutLogs}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <Text>{item.activity}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Duration: {item.duration} minutes</Text>
                <Text>Weight: {(parseFloat(item.weight) * weightUnit).toFixed(0)} {weightUnit === 1 ? 'kg' : "lbs"}</Text>
                <Text>Burned: {(item.caloriesBurned / energyUnit).toFixed(0)} {energyUnit === 1 ? "kJ" : "kcal"}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Button title="-" onPress={() => handleDelete(item)} color="#FF6347" />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default WorkoutLog;
