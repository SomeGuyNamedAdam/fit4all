import { ScrollView, StyleSheet, View } from 'react-native';
import FoodCalories from '@/components/FoodCalories';
import NutritionWheel from '@/components/NutritionWheel';
import WorkoutCalories from '@/components/WorkoutCalories';
import WeightTrackerChart from '@/components/WeightTrackerChart';
import { TextInput } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <View style={{marginRight: 5, flex: 1}}>
          <FoodCalories />
        </View>
        <View style={{marginLeft: 5, flex: 1}}>
          <WorkoutCalories />
        </View>
      </View>
      <NutritionWheel />
      <WeightTrackerChart />
      <ThemedText></ThemedText>
    </ScrollView>
  );
}

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
