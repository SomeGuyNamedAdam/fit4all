
import FoodCalories from '@/components/FoodCalories'
import FoodList from '@/components/FoodList'
import NutritionWheel from '@/components/NutritionWheel'
import { ThemedButton } from '@/components/ThemedButton'
import { Link, router } from 'expo-router'
import React from 'react'
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native'

export default function food(){
  return (
    <View style={{ flex: 1, padding: 10, marginTop: 30 }}>
      <FoodCalories/>
      <NutritionWheel />
      <ThemedButton title='Add Food' onPress={() => {router.push(`/food/search`)}} />
      <FoodList />
    </View>
  )
}

const styles = StyleSheet.create({})