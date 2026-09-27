import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FeaturedCard from "@/components/FeaturedCard";
import { Property } from "@/types";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("FEATURED:", featured);
  console.log("RECOMMENDED:", recommended);

  const fetchProperties = async () => {
    try {
      setLoading(true);

     
      // Featured Properties
      // =========================
      const {
        data: featuredData,
        error: featuredError,
      } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      console.log("FEATURED DATA:", featuredData);
      console.log("FEATURED ERROR:", featuredError);

      
      // Recommended Properties
      // =========================
      const {
        data: recommendedData,
        error: recommendedError,
      } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      console.log("RECOMMENDED DATA:", recommendedData);
      console.log("RECOMMENDED ERROR:", recommendedError);

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);
    } catch (error) {
      console.log("FETCH PROPERTIES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}

       
        // Header
        // =========================
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("../../../assets/images/logo.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />

              <View className="items-end">
                <Text className="font-bold">
                  Good Morning ✋
                </Text>

                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
              onPress={() =>
                router.push("/(root)/(tabs)/search")
              }
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color="#9CA3AF"
              />

              <Text className="text-gray-400 flex-1">
                Search properties, cities...
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push(
                    "/(root)/(tabs)/search?openFilters=true"
                  )
                }
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
              >
                <Ionicons
                  name="options-outline"
                  size={15}
                  color="white"
                />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured Section */}
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : featured.length > 0 ? (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FeaturedCard property={item} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                  }}
                />
              ) : (
                <View className="items-center py-10">
                  <Text className="text-gray-400">
                    No featured properties found
                  </Text>
                </View>
              )}
            </View>

            {/* Recommended Header */}
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }

       
        // Recommended Properties
        // =========================
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/(root)/property/${item.id}` as any
              )
            }
            className="mx-5 mb-4 bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            {/* Property Image */}
            {item.images?.[0] ? (
              <Image
                source={{ uri: item.images[0] }}
                className="w-full h-48"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-48 bg-gray-200 items-center justify-center">
                <Ionicons
                  name="image-outline"
                  size={40}
                  color="#9CA3AF"
                />
              </View>
            )}

            {/* Property Information */}
            <View className="p-4">
              <Text
                className="text-base font-bold text-gray-800 mb-1"
                numberOfLines={1}
              >
                {item.title}
              </Text>

              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="location-outline"
                  size={14}
                  color="#6B7280"
                />

                <Text
                  className="text-xs text-gray-500 ml-1"
                  numberOfLines={1}
                >
                  {item.address}, {item.city}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-blue-600 font-bold text-base">
                  {item.price}
                </Text>

                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="bed-outline"
                      size={14}
                      color="#6B7280"
                    />

                    <Text className="text-xs text-gray-500">
                      {item.bedrooms}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="water-outline"
                      size={14}
                      color="#6B7280"
                    />

                    <Text className="text-xs text-gray-500">
                      {item.bathrooms}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        // =========================
        // No Recommended Data
        // =========================
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">
                No recommended properties found
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

