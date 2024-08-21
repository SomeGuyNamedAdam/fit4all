import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedButton } from './ThemedButton';
import { ThemedText } from './ThemedText';

interface Product {
  id: string;
  key: string;
  product_name: string;
  nutriments: {
    energy_100g?: string;
    fat_100g?: string;
    proteins_100g?: string;
    carbohydrates_100g?: string;
  };
  energy?: string;
  amount?: string;
  dateAdded?: string;
}



const FoodList = () => {
  const [addedFoods, setAddedFoods] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [energyUnit, setEnergyUnit] = useState(1)

  const fetchAddedFoods = async () => {
    try {
      const storedFoodsString = await AsyncStorage.getItem('storedProducts');
      const energyUnitString = await AsyncStorage.getItem('energyUnit');
      if (storedFoodsString) {
        const storedFoods = JSON.parse(storedFoodsString);
        setAddedFoods(storedFoods);
      }
      if (energyUnit){
        const unit = energyUnitString === 'kj' ? 1 : 4.184
        setEnergyUnit(unit)
      }
    } catch (error) {
      console.error('Failed to fetch added foods', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddedFoods();
    }, [])
  );

  const handlePress = (item: Product) => {
    router.push(`/food/detail?id=${item.id}`);
  };

  const clearStoredProducts = async () => {
    try {
      await AsyncStorage.removeItem('storedProducts');
      setAddedFoods([]);
    } catch (error) {
      console.error('Failed to clear stored products', error);
    }
  };

  const filterFoodsByDate = (foods: Product[], date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return foods.filter(food => food.dateAdded === dateString);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const calculateTotalEnergy = (item: Product) => {
    const amount = parseFloat(item.amount || '0');
    const energyPer100g = parseFloat(item.nutriments.energy_100g || '0');
    return (amount * energyPer100g / 100 / energyUnit).toFixed(0);
  };

  const deleteItem = async (key: string) => {
    try {
      const updatedFoods = addedFoods.filter(food => food.key !== key);
      await AsyncStorage.setItem('storedProducts', JSON.stringify(updatedFoods));
      setAddedFoods(updatedFoods);
    } catch (error) {
      console.error('Failed to delete the item', error);
    }
  };

  const handleDelete = (item: Product) => {
    if (Platform.OS === 'web') {
      deleteItem(item.key);
    } else {
      confirmDelete(item);
    }
  };

  const confirmDelete = (item: Product) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete ${item.product_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => deleteItem(item.key) },
      ],
      { cancelable: true }
    );
  };

  const confirmClearDateSpecificItems = () => {
    Alert.alert(
      'Clear Items',
      'Are you sure you want to clear all food items added on the selected date?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => clearDateSpecificProducts() },
      ],
      { cancelable: true }
    );
  };
  
  const clearDateSpecificProducts = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const remainingFoods = addedFoods.filter(food => food.dateAdded !== dateString);
      await AsyncStorage.setItem('storedProducts', JSON.stringify(remainingFoods));
      setAddedFoods(remainingFoods);
    } catch (error) {
      console.error('Failed to clear products for the selected date', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const filteredFoods = filterFoodsByDate(addedFoods, selectedDate);

  return (
    <View style={{ flex: 1, padding: 0 }}>
      <ThemedText type='subtitle' style={{  fontWeight: 'bold', textAlign : 'center', padding: 10}}>-- Added Food Items --</ThemedText>
      <View style={styles.row}>
      <ThemedButton title="Select Date" style={styles.item} onPress={() => setShowDatePicker(true)} type='primary' />
      <ThemedButton title="Clear All Items" style={styles.item} onPress={confirmClearDateSpecificItems} type='danger' />
        </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {filteredFoods.length === 0 ? (
        <ThemedText>No food items added on this date.</ThemedText>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredFoods}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => handlePress(item)}>
              <ThemedText>{item.product_name.charAt(0).toUpperCase() + item.product_name.slice(1)}</ThemedText>

                <ThemedText>Energy: {calculateTotalEnergy(item)} {energyUnit === 1 ? 'kJ' : "kcal" }</ThemedText>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <ThemedButton title="-" onPress={() => handleDelete(item)} type='danger'/>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FoodList;

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