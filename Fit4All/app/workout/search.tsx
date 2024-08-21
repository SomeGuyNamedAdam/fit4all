import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import workouts from '@/assets/datasets/workout.json'; // Adjust the path based on your directory structure
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';

interface Activity {
  code: string;
  value: number;
  description: string;
}

interface Workouts {
  [category: string]: Activity[];
}

const workoutsData: Workouts = workouts as Workouts;

const generateUniqueKey = (activity: string): string => {
  return `${activity}-${new Date().getTime()}`;
};

const Search = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);

  useEffect(() => {
    setCategories(Object.keys(workoutsData));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setActivities(workoutsData[selectedCategory]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    calculateCalories(); // Recalculate whenever duration, weight, or selected activity changes
  }, [selectedActivity, duration, weight]);

  const calculateCalories = () => {
    if (selectedActivity && duration && weight) {
      const activity = activities.find(act => act.description === selectedActivity);
      if (activity) {
        const durationInHours = parseFloat(duration) / 60;
        const weightInKg = parseFloat(weight);
        const calories = activity.value * durationInHours * weightInKg;
        setCaloriesBurned(parseFloat(calories.toFixed(0)));
      } else {
        setCaloriesBurned(0);
      }
    } else {
      setCaloriesBurned(0);
    }
  };

  const saveWorkout = async () => {
    if (selectedActivity && duration && weight) {
      const workout = {
        key: generateUniqueKey(selectedActivity),
        category: selectedCategory,
        activity: selectedActivity,
        duration,
        weight,
        caloriesBurned,
        date: new Date().toISOString().split('T')[0], // Save today's date in ISO format
      };

      try {
        // Save workout to AsyncStorage
        const existingWorkouts = await AsyncStorage.getItem('doneWorkouts');
        const workoutsArray = existingWorkouts ? JSON.parse(existingWorkouts) : [];
        workoutsArray.push(workout);
        await AsyncStorage.setItem('doneWorkouts', JSON.stringify(workoutsArray));

        // Update weight tracker in AsyncStorage
        const existingWeightsString = await AsyncStorage.getItem('weightTracker');
        const weightTrackerArray = existingWeightsString ? JSON.parse(existingWeightsString) : [];
        const weightEntry = {
          weight: parseFloat(weight),
          date: new Date().toISOString(), // Save today's date in ISO format
        };
        weightTrackerArray.push(weightEntry);
        await AsyncStorage.setItem('weightTracker', JSON.stringify(weightTrackerArray));

        alert('Workout saved successfully!');
      } catch (error) {
        console.error('Failed to save workout', error);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Add Exercise' }} />
      <ThemedText style={styles.label}>Select Category:</ThemedText>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>

      {selectedCategory ? (
        <>
          <ThemedText style={styles.label}>Select Activity:</ThemedText>
          <Picker
            selectedValue={selectedActivity}
            onValueChange={(itemValue) => setSelectedActivity(itemValue)}
            style={styles.picker}
          >
            {activities.map((activity) => (
              <Picker.Item key={activity.code} label={activity.description} value={activity.description} />
            ))}
          </Picker>
        </>
      ) : null}

      <ThemedTextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      <ThemedTextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      {caloriesBurned > 0 ? (
        <ThemedText style={styles.result}>Calories Burned: {caloriesBurned}</ThemedText>
      ) : null}

      <Button title="Save Workout" onPress={saveWorkout} />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
});
