import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const filteredFoods = filterFoodsByDate(addedFoods, selectedDate);

  return (
    <View style={{ flex: 1, padding: 0 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Added Food Items</Text>
      <Button title="Clear All Items" onPress={clearStoredProducts} color="#FF6347" />
      <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {filteredFoods.length === 0 ? (
        <Text>No food items added on this date.</Text>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={filteredFoods}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 }}>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <Text>{item.product_name}</Text>
                <Text>Energy: {calculateTotalEnergy(item)} {energyUnit === 1 ? 'kJ' : "kcal" }</Text>
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

export default FoodList;
