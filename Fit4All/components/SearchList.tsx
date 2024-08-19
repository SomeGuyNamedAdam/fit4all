import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export function SearchList() {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>List thingy</Text>
    </View>
  )
}

export default SearchList

const styles = StyleSheet.create({
    view: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#00FF00',
    },
    text :{
        fontSize: 28,

    }
})