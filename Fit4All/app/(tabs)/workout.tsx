import ThemedButton from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import WorkoutCalories from '@/components/WorkoutCalories'
import WorkoutLog from '@/components/WorkoutLog'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useFocusEffect } from '@react-navigation/native'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'

const workout = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  useFocusEffect(
    useCallback(() => {
      // Set the selected date to today's date when the screen is focused
      setSelectedDate(new Date());
    }, [])
  );
  return (
    <View style={{ flex: 1, padding: 10, marginTop: 30 }}>
      <ThemedText type='title'>Workout log</ThemedText>
      <WorkoutCalories selectedDate={selectedDate}/>
      <ThemedButton title='Add' style={styles.button} type='primary'onPress={() => {router.push(`/workout/search`)}} />
      <ThemedButton title="Select Date" style={styles.button} onPress={showDatePickerModal} type='primary' />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <WorkoutLog selectedDate={selectedDate}/>
    </View>
  )
}

export default workout

const styles = StyleSheet.create({
  button : {
    marginVertical : 5
  }
});