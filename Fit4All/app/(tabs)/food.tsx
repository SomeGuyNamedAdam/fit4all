import { CaloriesCounter } from '@/components/CaloriesCounter'
import FoodList from '@/components/FoodList'
import NutritionWheel from '@/components/NutritionWheel'
import { Link, router } from 'expo-router'
import React from 'react'
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native'

export default function food(){
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <CaloriesCounter source='food' />
      <NutritionWheel />
      <Button title='Search' onPress={() => {router.push(`/food/search`)}} />
      <FoodList />
    </View>
  )
}

const styles = StyleSheet.create({})