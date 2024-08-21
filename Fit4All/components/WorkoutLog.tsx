import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Alert, FlatList, Platform, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';  // Add this import
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';

interface Workout {
  id: string;
  key: string;
  category: string;
  activity: string;
  duration: string;
  weight: string;
  caloriesBurned: number;
  date: string;
}

const WorkoutLog = () => {
  const [workoutLogs, setWorkoutLogs] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [energyUnit, setEnergyUnit] = useState(1);
  const [weightUnit, setWeightUnit] = useState(1);

  const fetchWorkoutLogs = async () => {
    try {
      const storedWorkoutsString = await AsyncStorage.getItem('doneWorkouts');
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      const weightUnitString = await AsyncStorage.getItem('weightUnit');
      if (storedWorkoutsString) {
        const storedWorkouts = JSON.parse(storedWorkoutsString);
        setWorkoutLogs(storedWorkouts);
      }
      if (energyUnit) {
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      }
      if (weightUnit) {
        const unit = weightUnitString === 'lbs' ? 1 : 2.205;
        setWeightUnit(unit);
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

  const filterWorkoutsByDate = (workouts: Workout[], date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return workouts.filter(workout => workout.date === dateString);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const confirmClearDateSpecificItems = () => {
    Alert.alert(
      'Clear Workouts',
      'Are you sure you want to clear all workout logs for the selected date?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => clearDateSpecificWorkouts() },
      ],
      { cancelable: true }
    );
  };

  const clearDateSpecificWorkouts = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const remainingWorkouts = workoutLogs.filter(workout => workout.date !== dateString);
      await AsyncStorage.setItem('doneWorkouts', JSON.stringify(remainingWorkouts));
      setWorkoutLogs(remainingWorkouts);
    } catch (error) {
      console.error('Failed to clear workout logs for the selected date', error);
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

  const filteredWorkouts = filterWorkoutsByDate(workoutLogs, selectedDate)

  return (
    <View style={{ flex: 1, padding: 0 }}>
      <ThemedText type='subtitle' style={{ fontWeight: 'bold', textAlign: 'center', padding: 10 }}>-- Workout Log --</ThemedText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <ThemedButton title="Select Date" onPress={() => setShowDatePicker(true)} type="primary" />
        <ThemedButton title="Clear Logs for Selected Date" onPress={confirmClearDateSpecificItems} type="danger" />
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {filteredWorkouts.length === 0 ? (
        <ThemedText>No workout logs available for the selected date.</ThemedText>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredWorkouts}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <ThemedText>{item.activity.charAt(0).toUpperCase() + item.activity.slice(1)}</ThemedText>
                <ThemedText>Duration: {item.duration} minutes</ThemedText>
                <ThemedText>Burned: {(item.caloriesBurned / energyUnit).toFixed(0)} {energyUnit === 1 ? "kJ" : "kcal"}</ThemedText>
                
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <ThemedButton title="-" type="danger" onPress={() => handleDelete(item)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default WorkoutLog;


const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjusts space between items
  },
  item: {
    flex: 1, // Allows the components to expand and fill the available space
    marginHorizontal: 5, // Adds space between the components
  },
});