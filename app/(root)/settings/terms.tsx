import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsScreen() {
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
          Terms & Conditions
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

        <TermsSection
          title="1. Acceptance of Terms"
          text="By using DreamHouse, you agree to use the application responsibly and in accordance with these Terms & Conditions."
        />

        <TermsSection
          title="2. Property Information"
          text="Property information displayed in DreamHouse may be provided by property owners, agents, or administrators. Users should independently verify property details before making any purchase, rental, or financial decision."
        />

        <TermsSection
          title="3. User Accounts"
          text="Users are responsible for maintaining the security of their account and for activities performed through their account."
        />

        <TermsSection
          title="4. Saved Properties"
          text="The Saved Properties feature is provided for convenience. Availability of a saved property may change at any time."
        />

        <TermsSection
          title="5. Contacting Agents"
          text="DreamHouse may provide contact options for property agents or administrators. Communications with third parties are the responsibility of the parties involved."
        />

        <TermsSection
          title="6. Prohibited Use"
          text="Users must not use DreamHouse for unlawful activities, fraudulent activities, abuse, harassment, or attempts to interfere with the normal operation of the application."
        />

        <TermsSection
          title="7. Availability"
          text="We may update, modify, suspend, or discontinue parts of the application when necessary."
        />

        <TermsSection
          title="8. Changes to These Terms"
          text="These Terms & Conditions may be updated from time to time. Continued use of the application after changes means that the updated terms may apply."
        />

        <TermsSection
          title="9. Contact"
          text="For questions regarding these Terms & Conditions, please contact DreamHouse support."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function TermsSection({
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