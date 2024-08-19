import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const create = () => {
  return (
    <View>
      <Stack.Screen options={{headerTitle: `Create your own food`}}/>
      <Text>create</Text>
    </View>
  )
}

export default create

const styles = StyleSheet.create({})