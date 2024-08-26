import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import { Workout } from '@/types';


interface WorkoutLogProps {
  selectedDate?: Date; // Make selectedDate optional
}

const WorkoutLog: React.FC<WorkoutLogProps> = ({ selectedDate }) => {
  const [workoutLogs, setWorkoutLogs] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [energyUnit, setEnergyUnit] = useState(4.184);
  const [weightUnit, setWeightUnit] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  // Use effect to set the default date if selectedDate is not provided
  useEffect(() => {
    setCurrentDate(selectedDate || new Date());
  }, [selectedDate]);

  const fetchWorkoutLogs = async () => {
    try {
      const storedWorkoutsString = await AsyncStorage.getItem('doneWorkouts');
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      const weightUnitString = await AsyncStorage.getItem('weightUnit');
      if (storedWorkoutsString) {
        const storedWorkouts = JSON.parse(storedWorkoutsString);
        setWorkoutLogs(storedWorkouts);
      }
      if (energyUnitString) {
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      }
      if (weightUnitString) {
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
      const dateString = currentDate.toISOString().split('T')[0];
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

  // Reverse the filtered workouts array before passing it to the FlatList
  const filteredWorkouts = filterWorkoutsByDate(workoutLogs, currentDate).reverse();

  return (
    <View style={{ flex: 1, padding: 0 }}>
      <ThemedText type='subtitle' style={styles.subtitle}>-- Workout Log --</ThemedText>
      
      <ThemedButton title="Clear Logs for Selected Date" onPress={confirmClearDateSpecificItems} type="danger" />
      
      {filteredWorkouts.length === 0 ? (
        <ThemedText>No workout logs available for the selected date.</ThemedText>
        
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredWorkouts}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemTouchable}>
                  <ThemedText style={styles.activityText}>{item.activity.charAt(0).toUpperCase() + item.activity.slice(1)}</ThemedText>
                  <ThemedText style={styles.detailText}>Duration: {item.duration} minutes</ThemedText>
                  <ThemedText style={styles.detailText}>Burned: {(item.caloriesBurned / energyUnit).toFixed(0)} {energyUnit === 1 ? "kJ" : "kcal"}</ThemedText>
                </TouchableOpacity>
              </View>
              <View style={styles.deleteButtonContainer}>
                <ThemedButton title="-" type="danger" onPress={() => handleDelete(item)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemTouchable: {
    flex: 1,
  },
  activityText: {
    flexShrink: 1, // Allow text to shrink and wrap
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  detailText: {
    fontSize: 14,
    color: 'gray',
    marginRight: 10,
  },
});

export default WorkoutLog;
