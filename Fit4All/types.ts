export interface Nutriments {
  energy_100g?: string;
  fat_100g?: string;
  proteins_100g?: string;
  carbohydrates_100g?: string;
}

export interface Product {
  id?: string;
  key?: string;
  product_name: string;
  brands?: string;
  countries_tags?: string[];
  nutriments: Nutriments;
  amount?: string;
  dateAdded?: string; // Ensure the dateAdded field is available
  unique_scans_n?: number; // Popularity metric
  relevanceScore?: number;
}
export interface WeightData {
  value: number;
  date: Date;
}
export interface Workout {
  key : string;
  category: string;
  activity: string;
  duration: string;
  weight: string;
  caloriesBurned: number;
  date: string;
}
export interface Activity {
  code: string;
  value: number;
  description: string;
}
export interface Activities {
  [category: string]: Activity[];
}
export interface CountryCodes {
  [key: string]: string[]; // This allows any string as a key, with the value being an array of strings
}