import Calories, { CaloriesCounter } from '@/components/CaloriesCounter'
import WorkoutLog from '@/components/WorkoutLog'
import { Link, router } from 'expo-router'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

const workout = () => {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <CaloriesCounter source='workout'/>
      <Button title='Add' onPress={() => {router.push(`/workout/search`)}} />
      <WorkoutLog />
    </View>
  )
}

export default workout

const styles = StyleSheet.create({})