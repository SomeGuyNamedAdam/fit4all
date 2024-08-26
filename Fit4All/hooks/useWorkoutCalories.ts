import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface Workout {
  category: string;
  activity: string;
  duration: string;
  weight: string;
  caloriesBurned: number;
  date: string;
}

export function useWorkoutCalories() {
  const [calories, setCalories] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0); // Total duration in minutes
  const [energyUnit, setEnergyUnit] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const existingWorkouts = await AsyncStorage.getItem('doneWorkouts');
        const workoutsArray: Workout[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        let totalCalories = 0;
        let totalDuration = 0;

        workoutsArray.forEach(workout => {
          if (workout.date.startsWith(today)) {
            totalCalories += workout.caloriesBurned;
            totalDuration += parseFloat(workout.duration);
          }
        });

        setCalories(totalCalories);
        setTotalDuration(totalDuration);
      } catch (error) {
        console.error('Failed to fetch workouts', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnits = async () => {
      try {
        const energyUnitString = await AsyncStorage.getItem('energyUnit');
        const unit = energyUnitString === 'kj' ? 1 : 4.184;
        setEnergyUnit(unit);
      } catch (error) {
        console.error('Failed to fetch energy unit', error);
      }
    };

    fetchWorkouts();
    fetchUnits();
  }, []);

  return {
    calories,
    totalDuration,
    energyUnit,
    loading,
  };
}
