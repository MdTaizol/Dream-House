import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#374151"
          />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800 ml-4">
          About DreamHouse
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      >
        {/* Logo */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-3xl bg-blue-600 items-center justify-center">
            <Ionicons
              name="home"
              size={48}
              color="white"
            />
          </View>

          <Text className="text-2xl font-bold text-gray-800 mt-5">
            DreamHouse
          </Text>

          <Text className="text-gray-500 mt-1">
            Find a place you can call home.
          </Text>
        </View>

        <Section
          title="About the App"
          text="DreamHouse is a real-estate application designed to make property discovery simple and convenient. Users can explore available properties, view detailed information, save properties, and contact the property agent."
        />

        <Section
          title="Our Goal"
          text="Our goal is to provide a clean and convenient property browsing experience while making it easier for users to discover homes and real-estate opportunities."
        />

        <Section
          title="Features"
          text={
            "• Browse properties\n" +
            "• View property details\n" +
            "• Save favourite properties\n" +
            "• Property image gallery\n" +
            "• Location and map preview\n" +
            "• Contact property agent\n" +
            "• Secure user authentication"
          }
        />

        <Section
          title="Version"
          text="DreamHouse Mobile App — Version 1.0.0"
        />

        <View className="items-center mt-6">
          <Text className="text-xs text-gray-400">
            © 2026 DreamHouse
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View className="mb-7">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        {title}
      </Text>

      <Text className="text-gray-600 leading-6">
        {text}
      </Text>
    </View>
  );
}