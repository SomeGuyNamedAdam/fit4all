import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  product_name: string;
  nutriments: {
    energy_100g?: string;
    fat_100g?: string;
    proteins_100g?: string;
    carbohydrates_100g?: string;
  };
}

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();

  const fetchResults = async () => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&search_nutriment_0=energy&search_nutriment_1=fat&search_nutriment_2=proteins&search_nutriment_3=carbohydrates&fields=product_name,nutriments,id&json=1`);
      const data = await response.json();
      
      // Filter products to include those with both a non-empty name and calories (energy_100g) data
      const filteredProducts = data.products.filter((product: Product) => 
        product.product_name && product.product_name.trim() !== '' && product.nutriments.energy_100g
      );
      
      // Calculate relevance score based on the number of matches of the search term in the product name
      const scoredProducts = filteredProducts.map((product: { product_name: { toLowerCase: () => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; }; new(): any; }; }; }; }) => {
        const relevanceScore = product.product_name.toLowerCase().split(searchTerm.toLowerCase()).length - 1;
        return { ...product, relevanceScore };
      });

      // Sort products based on relevance score in descending order
      const sortedProducts = scoredProducts.sort((a: { relevanceScore: number; }, b: { relevanceScore: number; }) => b.relevanceScore - a.relevanceScore);
      
      setResults(sortedProducts);
    } catch (error) {
      console.error("Failed to fetch results", error);
    }
  };
  

  const handlePress = async (item: Product) => {
    try {
      // Save the selected product to AsyncStorage
      await AsyncStorage.setItem('currentFood', JSON.stringify(item));
      // Navigate to the details screen
      router.push('./detail');
    } catch (error) {
      console.error('Failed to save the product', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
        <Stack.Screen options={{headerTitle: `Search food`}} />
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search for a product"
        style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
      />
      <Button title="Search" onPress={fetchResults} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
          >
            <Text style={{ padding: 16, borderBottomWidth: 1 }}>{item.product_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchScreen;
