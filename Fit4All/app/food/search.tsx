import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import products from "@/assets/datasets/products.json";

interface Product {
  product_name: string;
  brands?: string;
  countries_tags?: string[];
  nutriments: {
    energy_100g?: string;
    fat_100g?: string;
    proteins_100g?: string;
    carbohydrates_100g?: string;
  };
  unique_scans_n?: number; // Popularity metric
  relevanceScore?: number; // Relevance score to display
}

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [hasSearched, setHasSearched] = useState(false);
  const [country, setCountry] = useState("")
  const router = useRouter();
  const textColor = useThemeColor({}, "text");

  // Constants for relevance calculation // User's current country
  const LENGTH_WEIGHT = 1.0; // Weight for shorter terms
  const COUNTRY_WEIGHT = 18.0; // Weight for matching country
  const WORLD_WEIGHT = 24.0;
  const POPULARITY_WEIGHT = 0.08; // Weight for product popularity
  const QUERY_MATCH_WEIGHT = 6.0; // Weight for query appearing in the name
  const QUERY_POSITION_WEIGHT = 10.2; // Weight for query at the start of the name
  const PARTIAL_MATCH_WEIGHT = 3.0; // Weight for partial matches
  const RELEVANCY_MIN = 4.0;

  useFocusEffect(useCallback(() => {
    const fetchCountry = async () => {
      try {
        const storedCountry = await AsyncStorage.getItem('userCountry')  
        setCountry(storedCountry ? ("en:" + storedCountry) : "")
      } catch (error) {
        console.error
      }
    }
    fetchCountry();
    
  },[]))
  const fetchResults = async () => {
    setLoading(true); // Show loading indicator
    setHasSearched(true);
    try {
      // API Query Construction
      let query = `search_terms=${searchTerm}&search_nutriment_0=energy&search_nutriment_1=fat&search_nutriment_2=proteins&search_nutriment_3=carbohydrates&page_size=50&fields=product_name,brands,countries_tags,nutriments,unique_scans_n,id&json=1`;

      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?${query}`
      );
      const apiData = await response.json();

      // Filter API Products
      const filteredApiProducts = apiData.products.filter(
        (product: Product) =>
          product.product_name &&
          product.product_name.trim() !== "" &&
          product.nutriments.energy_100g
      );

      // Split the search term into parts
      const searchTerms = searchTerm.toLowerCase().split(" ");

      // Integrate Local JSON Data and filter by product_name
      const localProducts: Product[] = products
        .filter((item: any) => {
          // Check if the product name contains any of the search terms
          const lowercasedProductName = item.product_name.toLowerCase();
          return searchTerms.some((term) =>
            lowercasedProductName.includes(term)
          );
        })
        .map((item: any) => ({
          product_name: item.product_name,
          countries_tags: item.countries_tags || ["en:world"],
          nutriments: {
            energy_100g: item.nutriments.energy_100g
              ? item.nutriments.energy_100g.toString()
              : "",
            fat_100g: item.nutriments.fat_100g
              ? item.nutriments.fat_100g.toString()
              : "",
            proteins_100g: item.nutriments.proteins_100g
              ? item.nutriments.proteins_100g.toString()
              : "",
            carbohydrates_100g: item.nutriments.carbohydrates_100g
              ? item.nutriments.carbohydrates_100g.toString()
              : "",
          },
        }));

      
        const userProductsString = await AsyncStorage.getItem('userProducts')
        const userProducts = userProductsString ? JSON.parse(userProductsString) : []
      
      // Combine API and Local Data
      const combinedProducts = [...filteredApiProducts, ...localProducts, ...userProducts];

      // Calculate relevance score based on several factors
      const scoredProducts = combinedProducts.map((product: Product) => {
        let relevanceScore = 0;

        // Ensure the product_name exists before using it
        if (!product.product_name) return { ...product, relevanceScore };

        const lowercasedProductName = product.product_name.toLowerCase();

        // Factor 1: Shorter product names should have a higher score
        relevanceScore += LENGTH_WEIGHT / product.product_name.length;

        // Factor 2: Boost relevance if the product is available in the user's country
        if (country !== null){
        if (product.countries_tags?.includes(country)) {
          relevanceScore += COUNTRY_WEIGHT;
        }
      }

        // Factor 2.1: Boost relevance if the product is available globally
        if (product.countries_tags?.includes("en:world")) {
          relevanceScore += WORLD_WEIGHT;
        }

        // Factor 3: Add weight based on product popularity (only applies to API data)
        if (product.unique_scans_n) {
          relevanceScore += POPULARITY_WEIGHT * product.unique_scans_n;
        }

        // Factor 4: Boost if the search term is in the product name
        if (searchTerms.some((term) => lowercasedProductName.includes(term))) {
          relevanceScore += QUERY_MATCH_WEIGHT;

          // Additional boost if the search term is at the start of the product name
          if (
            searchTerms.some((term) => lowercasedProductName.startsWith(term))
          ) {
            relevanceScore += QUERY_POSITION_WEIGHT;
          }

          // Additional boost for each part of the search term that matches the product name
          searchTerms.forEach((term) => {
            if (lowercasedProductName.includes(term)) {
              relevanceScore += PARTIAL_MATCH_WEIGHT;
            }
          });
        }

        return { ...product, relevanceScore };
      });

      const filteredScoredProducts = scoredProducts.filter(
        (product) => (product.relevanceScore || 0) >= RELEVANCY_MIN
      );

      // Sort products based on relevance score in descending order
      const sortedProducts = filteredScoredProducts.sort(
        (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
      );

      const limitedResults = sortedProducts.slice(0, 50);

      // Set the results
      setResults(limitedResults);
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handlePress = async (item: Product) => {
    try {
      // Save the selected product to AsyncStorage
      await AsyncStorage.setItem("currentFood", JSON.stringify(item));
      // Navigate to the details screen
      router.push("./detail");
    } catch (error) {
      console.error("Failed to save the product", error);
    }
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      {hasSearched && results.length === 0 && (
        <>
          <ThemedText style={styles.noResultsText}>
            No results found
          </ThemedText>
        </>
      )}
      {hasSearched && (
        <>
          <ThemedText style={styles.noResultsSubText}>
            Couldn't find what you were looking for?
          </ThemedText>
          <ThemedButton
            title="Add your own food"
            onPress={() => {
              router.push('/food/create')
            }}
          />
        </>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          headerTitle: "Search for food",
          headerTintColor: textColor,
          headerTitleStyle: {
            color: textColor,
          },
        }}
      />

      <ThemedTextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search for a product"
        style={styles.input}
        onSubmitEditing={fetchResults}
      />

      <ThemedButton title="Search" onPress={fetchResults} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={textColor}
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <View style={styles.itemContainer}>
                <ThemedText style={styles.productName}>
                  {item.product_name}
                </ThemedText>
                <View style={styles.detailsContainer}>
                  {item.brands && (
                    <ThemedText style={styles.detailText}>
                      Brand:{" "}
                      {item.brands
                        .split(",")
                        .map((brand) => brand.trim())
                        .join(", ")}
                    </ThemedText>
                  )}
                  {item.countries_tags && (
                    <ThemedText style={styles.detailText}>
                      Available:{" "}
                      {item.countries_tags
                        .map(
                          (country) =>
                            country
                              .slice(3) // Remove the first three characters
                              .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
                        )
                        .join(", ")}
                    </ThemedText>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={renderFooter} // Add the footer component here
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailText: {
    fontSize: 14,
    color: "gray",
    marginRight: 10,
  },
  relevanceScore: {
    marginTop: 8,
    fontSize: 12,
    color: "green",
  },
  loadingIndicator: {
    marginTop: 16,
    alignSelf: "center",
  },
  footerContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  noResultsText: {
    fontSize: 16,
    color: "gray",
  },
  noResultsSubText: {
    fontSize: 16,
    color: "gray",
    marginVertical: 8,
  },
});

export default SearchScreen;
