import FoodCalories from '@/components/FoodCalories';
import FoodList from '@/components/FoodList';
import NutritionWheel from '@/components/NutritionWheel';
import Screen from '@/components/Screen';
import ThemedButton from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function FoodScreen() {
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
    <Screen>
      <ThemedText type='title'>Food log</ThemedText>
      <FoodCalories selectedDate={selectedDate} />
      {/* <NutritionWheel selectedDate={selectedDate} /> */}
      <ThemedButton title="Add Food" style={styles.button} onPress={() => {router.push('/food/search')}} type='primary' />
      <ThemedButton title="Select Date" style={styles.button}onPress={showDatePickerModal} type='primary' />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <FoodList selectedDate={selectedDate} onDateChange={handleDateChange} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  button : {
    marginVertical : 5
  }
});
