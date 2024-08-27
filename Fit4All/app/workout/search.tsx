import workouts from '@/assets/datasets/workout.json';
import Screen from '@/components/Screen';
import ThemedButton from '@/components/ThemedButton';
import { ThemedPicker } from '@/components/ThemedPicker';
import { ThemedText } from '@/components/ThemedText';
import ThemedTextInput from '@/components/ThemedTextInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Activity, WeightData, Activities as Workouts } from '@/types';

const workoutsData: Workouts = workouts as Workouts;

const generateUniqueKey = (activity: string): string => {
  return `${activity}-${new Date().getTime()}`;
};

const Search = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState(1)
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [energyUnit, setEnergyUnit] = useState(4.184)
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState<{ category: boolean; activity: boolean; hours: boolean; minutes: boolean; weight: boolean }>({
    category: false,
    activity: false,
    hours: false,
    minutes: false,
    weight: false,
  });
  const textColor = useThemeColor({}, 'text');

  const getUnits = async () => {
    try {
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      if (energyUnitString) {
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      }
  
      const weightUnitString = await AsyncStorage.getItem('weightUnit');
      if (weightUnitString) {
        const unit = weightUnitString === 'kg' ? 1 : 2.205;
        setWeightUnit(unit);
      }
  
      
    } catch (error) {
      console.error('Failed to fetch data', error);
    } 
  };

  const getWeight = async () => {
    try {
      const storedData = await AsyncStorage.getItem('weights');
      if (storedData) {
        const weights: WeightData[] = JSON.parse(storedData);
        if (weights.length > 0) {
          const latestWeightEntry = weights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          setWeight((latestWeightEntry.value * weightUnit).toFixed(2).toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch current weight', error)
    }
  }
  

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await getUnits();
          await getWeight();
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }, [])
  );

  useEffect(() => {
    setCategories(Object.keys(workoutsData));
  }, []);

  useEffect(() => {
    getWeight()
  }, [weightUnit])

  useEffect(() => {
    if (selectedCategory) {
      setActivities(workoutsData[selectedCategory]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    calculateCalories(); // Recalculate whenever duration, weight, or selected activity changes
  }, [selectedActivity, hours, minutes, weight]);

  const calculateCalories = () => {
    if (selectedActivity && (hours || minutes) && weight) {
      const hoursValue = parseFloat(hours) || 0;
      const minutesValue = parseFloat(minutes) || 0;
      const totalDurationInMinutes = hoursValue * 60 + minutesValue;

      if (totalDurationInMinutes > 0) {
        const activity = activities.find(act => act.description === selectedActivity);
        if (activity) {
          const durationInHours = totalDurationInMinutes / 60;
          
          const weightInKg = parseFloat((parseFloat(weight) / weightUnit).toFixed(2));
          const calories = activity.value * durationInHours * weightInKg;
          setCaloriesBurned(parseFloat(calories.toFixed(0)));
        } else {
          setCaloriesBurned(0);
        }
      } else {
        setCaloriesBurned(0);
      }
    } else {
      setCaloriesBurned(0);
    }
  };

  const validateInputs = () => {
    setIsError({
      category: !selectedCategory,
      activity: !selectedActivity,
      hours: !hours && !minutes,
      minutes: !minutes && !hours,
      weight: !weight,
    });
  };

  const saveWorkout = async () => {
    validateInputs();
    if (selectedActivity && (hours || minutes) && weight && selectedCategory) {
      const hoursValue = parseFloat(hours) || 0;
      const minutesValue = parseFloat(minutes) || 0;
      const durationInMinutes = hoursValue * 60 + minutesValue;
      const workout = {
        key: generateUniqueKey(selectedActivity),
        category: selectedCategory,
        activity: selectedActivity,
        duration: durationInMinutes.toString(),
        weight : (parseFloat(weight) / weightUnit).toFixed(2),
        caloriesBurned,
        date: new Date().toISOString().split('T')[0],
      };
      try {
        const existingWorkouts = await AsyncStorage.getItem('doneWorkouts');
        const workoutsArray = existingWorkouts ? JSON.parse(existingWorkouts) : [];
        workoutsArray.push(workout);
        await AsyncStorage.setItem('doneWorkouts', JSON.stringify(workoutsArray));

        const existingWeightsString = await AsyncStorage.getItem('weights');
        const weightTrackerArray = existingWeightsString ? JSON.parse(existingWeightsString) : [];
        const weightEntry = {
          value : parseFloat(weight) / weightUnit,
          date: new Date().toISOString(),
        };
        weightTrackerArray.push(weightEntry);
        await AsyncStorage.setItem('weights', JSON.stringify(weightTrackerArray));

        alert('Workout saved successfully!');
        router.navigate('/workout');
      } catch (error) {
        console.error('Failed to save workout', error);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  const handleTextChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
    const numericValue = text.replace(/[^0-9.]/g, '');
    setter(numericValue);
  };

  if(loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Screen type="scroll" style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Add Exercise",
          headerTintColor: textColor,
          headerTitleStyle: {
            color: textColor,
          },
        }}
      />
      <ThemedPicker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue as string)}
        items={categories.map((category) => ({
          label: category.charAt(0).toUpperCase() + category.slice(1),
          value: category,
        }))}
        style={[styles.picker, isError.category ? styles.pickerError : null]}
        placeholder="Choose a category"
        label="Select category:"
      />

      {selectedCategory ? (
        <>
          <ThemedPicker
            selectedValue={selectedActivity}
            onValueChange={(itemValue) =>
              setSelectedActivity(itemValue as string)
            }
            items={activities.map((activity) => ({
              label:
                activity.description.charAt(0).toUpperCase() +
                activity.description.slice(1),
              value: activity.description,
            }))}
            style={[
              styles.picker,
              isError.activity ? styles.pickerError : null,
            ]}
            placeholder="Choose an activity"
            label="Select activity:"
          />
        </>
      ) : null}

      <ThemedTextInput
        style={[styles.input, isError.hours ? styles.inputError : null]}
        placeholder="Hours"
        keyboardType="numeric"
        value={hours}
        onChangeText={handleTextChange(setHours)}
        label="Hours: "
      />

      <ThemedTextInput
        style={[styles.input, isError.minutes ? styles.inputError : null]}
        placeholder="Minutes"
        keyboardType="numeric"
        value={minutes}
        onChangeText={handleTextChange(setMinutes)}
        label="Minutes: "
      />

      <ThemedTextInput
        style={[styles.input, isError.weight ? styles.inputError : null]}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={handleTextChange(setWeight)}
        label={"Weight (" + (weightUnit === 1 ? "kg" : "lbs") + ")"}
      />

      {caloriesBurned > 0 ? (
        <ThemedText style={styles.result}>
          Burned: {(caloriesBurned / energyUnit).toFixed(0)}{" "}
          {energyUnit === 1 ? "kj" : "kcal"}
        </ThemedText>
      ) : null}

      <ThemedButton title="Save Workout" onPress={saveWorkout} />
    </Screen>
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
  input: {
    // height: 40,
    borderWidth: 1,
    // marginBottom: 20,
    // paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  picker: {
  },
  pickerError: {
    borderColor: 'red',
  },
  result: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
  },
});
