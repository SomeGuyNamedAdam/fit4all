import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Screen width for responsive design
const screenWidth = Dimensions.get('window').width;

// Example data
const weightData = [
  { date: '2024-01-01', value: 70 },
  { date: '2024-01-10', value: 71 },
  { date: '2024-02-01', value: 69 },
  { date: '2024-03-01', value: 68 },
  { date: '2024-04-01', value: 67 },
];

// Prepare chart data
const chartData = {
  labels: weightData.map((entry) => entry.date), // Array of date strings
  datasets: [
    {
      data: weightData.map((entry) => entry.value), // Array of weight values
      strokeWidth: 2, // Optional: Adjust the stroke width of the line
    },
  ],
};

const WeightHistoryChart = () => {
  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 18, marginVertical: 10 }}>
        Weight History
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32} // Adjust the width as needed
        height={220}
        yAxisLabel=""
        yAxisInterval={1} // Interval between labels on the y-axis
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f5f5f5',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Line color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier // Optional: Smooth the line
      />
    </View>
  );
};

export default WeightHistoryChart;
