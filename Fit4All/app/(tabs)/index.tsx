import { StyleSheet, View, Text } from 'react-native';

import { CaloriesCounter } from '@/components/CaloriesCounter';
import NutritionWheel from '@/components/NutritionWheel';
import WeightTracker from '@/components/WeightTracker';

export default function HomeScreen() {
  return (
    <View style={styles.view}>
      <Text>Home</Text>
      <CaloriesCounter source='food'/>
      <CaloriesCounter source='workout'/>
      <NutritionWheel />
      <WeightTracker />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
