import FoodCalories from '@/components/FoodCalories'
import { ThemedButton } from '@/components/ThemedButton'
import WorkoutCalories from '@/components/WorkoutCalories'
import WorkoutLog from '@/components/WorkoutLog'
import { Link, router } from 'expo-router'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const workout = () => {
  return (
    <View style={{ flex: 1, padding: 10, marginTop: 30 }}>
      <WorkoutCalories/>
      <ThemedButton title='Add' type='primary'onPress={() => {router.push(`/workout/search`)}} />
      <WorkoutLog />
    </View>
  )
}

export default workout

const styles = StyleSheet.create({})