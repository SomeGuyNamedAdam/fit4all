import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FoodCalories from '@/components/FoodCalories';
import NutritionWheel from '@/components/NutritionWheel';
import WorkoutCalories from '@/components/WorkoutCalories';
import WeightTrackerChart from '@/components/WeightTrackerChart';
import { TextInput } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import Screen from '@/components/Screen';
import { router } from 'expo-router';
import { GraphPoint, LineGraph } from 'react-native-graph';
import { SurfaceView } from '@/components/SurfaceView';

const examplePoints: GraphPoint[] = [
  { value: 10, date: new Date('2024-01-01T00:40:19.057Z') },
  { value: 15, date: new Date('2024-02-01T00:40:19.057Z') },
  { value: 20, date: new Date('2024-03-01T00:40:19.057Z') },
  { value: 25, date: new Date('2024-04-01T00:40:19.057Z') },
  { value: 30, date: new Date('2024-05-39T00:40:19.057Z') },
  { value: 35, date: new Date('2024-06-01T00:40:19.057Z') },
  { value: 40, date: new Date('2024-07-01T00:40:19.057Z') },
  { value: 45, date: new Date('2024-08-01T00:40:19.057Z') },
  { value: 80, date: new Date('2024-08-21T00:40:19.057Z') },
  { value: 50, date: new Date('2024-08-21T23:40:19.057') },
  { value: 55, date: new Date('2024-10-01T00:40:19.057Z') },
];

export default function HomeScreen() {
  return (
    <Screen type="scroll" style={styles.container}>
      <ThemedText type="title">Fit4All, Home</ThemedText>
      <View style={styles.row}>
        <TouchableOpacity
          style={{ marginRight: 5, flex: 1 }}
          onPress={() => {
            router.navigate("/food");
          }}
        >
          <FoodCalories />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: 5, flex: 1 }}
          onPress={() => {
            router.navigate("/workout");
          }}
        >
          <WorkoutCalories />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ marginRight: 5, flex: 1 }}
        onPress={() => {
          router.navigate("/food");
        }}
      >
        <NutritionWheel />
      </TouchableOpacity>
      <WeightTrackerChart />
      <SurfaceView style={styles.graphContainer}>
        <LineGraph
          points={examplePoints}
          animated={false}
          color="#3d3d3d"
          style={styles.lineGraph}
        />
      </SurfaceView>
      <ThemedText></ThemedText>
    </Screen>
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
  lineGraph: {
    flex: 1, // Make the LineGraph fill its container
  },
  graphContainer: {
    height: 300, // Set a height for the graph container
    marginVertical: 20, // Add some vertical margin
  },
});
