import FoodCalories from '@/components/FoodCalories';
import HelpButton from '@/components/HelpButton';
import NutritionWheel from '@/components/NutritionWheel';
import Screen from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import WeightTrackerChart from '@/components/WeightTrackerChart';
import WorkoutCalories from '@/components/WorkoutCalories';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';



export default function HomeScreen() {
  const logUserCountry = async () => {
    try {
      const userCountry = await AsyncStorage.getItem('userCountry');
      console.log(userCountry); // This will log the actual value or null if not set
    } catch (error) {
      console.error("Error retrieving userCountry from AsyncStorage:", error);
    }
  };
  logUserCountry();
  return (
    <Screen type="scroll" style={styles.container}>
      <ThemedText type="title">Home</ThemedText>
      <HelpButton title={'?'} message={'This is helpful'} messageTitle={'Help title'}/>
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
      <View style={{ marginRight: 5, flex: 1 }}>
      <WeightTrackerChart />
      </View>
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
