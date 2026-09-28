import { Ionicons } from "@expo/vector-icons";
import {
    Linking,
    Pressable,
    Text,
    View,
} from "react-native";

type PropertyMapProps = {
  mapUrl: string;
  mapLink: string;
};

export default function PropertyMap({
  mapLink,
}: PropertyMapProps) {
  const openMap = async () => {
    if (!mapLink) {
      return;
    }

    try {
      await Linking.openURL(mapLink);
    } catch (error) {
      console.error(
        "Open map error:",
        error
      );
    }
  };

  return (
    <View
      className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
      style={{
        height: 230,
      }}
    >
      <View className="flex-1 items-center justify-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <Ionicons
            name="location"
            size={32}
            color="#16A34A"
          />
        </View>

        <Text className="mt-4 text-lg font-bold text-gray-900">
          Property Location
        </Text>

        <Text className="mt-1 px-8 text-center text-sm text-gray-500">
          View this property on the map
        </Text>

        <Pressable
          onPress={openMap}
          className="mt-4 flex-row items-center rounded-xl bg-green-600 px-5 py-3"
        >
          <Ionicons
            name="map-outline"
            size={19}
            color="white"
          />

          <Text className="ml-2 font-semibold text-white">
            Open Map
          </Text>
        </Pressable>
      </View>
    </View>
  );
}