import SearchList from '@/components/SearchList'
import { Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const add = () => {
  return (
    <View>
      <Stack.Screen options={{headerTitle: `Add food to list`}}/>
      <Text> Add food to list page</Text>
      <SearchList />
    </View>
  )
}

export default add