import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
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
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 50,
        }}
      >
        <Text className="text-gray-400 text-sm mb-6">
          Last updated: September 2026
        </Text>

        <PolicySection
          title="1. Information We Collect"
          text="DreamHouse may collect information that you provide when creating or using your account, including your name and email address. Property-related information may also be stored when you interact with the application."
        />

        <PolicySection
          title="2. How We Use Information"
          text="Information may be used to provide authentication, maintain your account, provide property-related features, improve the application, and communicate with you when necessary."
        />

        <PolicySection
          title="3. Account Information"
          text="Your account information is associated with your authentication account. You can review or update available profile information from the Account Information section."
        />

        <PolicySection
          title="4. Saved Properties"
          text="Properties that you save may be associated with your account so that they can be displayed in your Saved Properties section."
        />

        <PolicySection
          title="5. Third-Party Services"
          text="DreamHouse may use third-party services for authentication, database services, maps, image storage, or communication. These services may process information according to their own policies."
        />

        <PolicySection
          title="6. Data Security"
          text="Reasonable technical measures are used to protect information handled by the application. However, no online service can guarantee absolute security."
        />

        <PolicySection
          title="7. Contact"
          text="If you have questions about this Privacy Policy or how information is handled, please contact DreamHouse support."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function PolicySection({
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