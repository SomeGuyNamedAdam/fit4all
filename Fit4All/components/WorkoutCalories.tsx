import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SurfaceView } from './SurfaceView';
import ThemedButton from './ThemedButton';
import { ThemedText } from './ThemedText';
import { Workout } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface WorkoutCaloriesProps {
  selectedDate?: Date; // Make selectedDate optional
}

export function WorkoutCalories({ selectedDate }: WorkoutCaloriesProps) {
  const { colors } = useTheme();

  const [calories, setCalories] = useState(0);
  const [energyUnit, setEnergyUnit] = useState(4.184);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Set default date to today if selectedDate is not provided
  useEffect(() => {
    setCurrentDate(selectedDate || new Date());
  }, [selectedDate]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await getCalories();
          await getUnits();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [selectedDate])
  );

  const getCalories = async () => {
    try {
      const storedDataString = await AsyncStorage.getItem('doneWorkouts');
      if (storedDataString) {
        const doneWorkouts: Workout[] = JSON.parse(storedDataString);
        
        const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        
        const filteredWorkouts = doneWorkouts.filter(workout => workout.date === dateString);
        
        let totalCalories = 0;
        filteredWorkouts.forEach(workout => {
          totalCalories += workout.caloriesBurned;
        });

        setCalories(totalCalories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUnits = async () => {
    try {
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      if (energyUnitString) {
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SurfaceView type="modal" style={styles.view}>
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>Exercise</ThemedText>
        <ThemedButton style={styles.button} title="+" type="primary" onPress={() => { router.push('/workout/search'); }} />
      </View>
      <View style={styles.row}>
      <Ionicons name='flame' size={30} style={styles.icon}/>

      <ThemedText style={styles.text}>
        : {(Math.round(calories) / energyUnit).toFixed(0)} {energyUnit === 1 ? 'kJ' : 'kcal'}
      </ThemedText>
      </View>
    </SurfaceView>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 28,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  }, 
  icon :{
    color: '#e67255'
  }
});

export default WorkoutCalories;
