import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountInformationScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  const currentFirstName = user.firstName || "";
  const currentLastName = user.lastName || "";

  const firstNameValue =
    firstName === "" ? currentFirstName : firstName;

  const lastNameValue =
    lastName === "" ? currentLastName : lastName;

  const email =
    user.emailAddresses?.[0]?.emailAddress || "No email";

  const handleSave = async () => {
    if (!firstNameValue.trim()) {
      Alert.alert("Required", "Please enter your first name.");
      return;
    }

    try {
      setSaving(true);

      await user.update({
        firstName: firstNameValue.trim(),
        lastName: lastNameValue.trim(),
      });

      await user.reload();

      setFirstName("");
      setLastName("");

      Alert.alert(
        "Success",
        "Your account information has been updated."
      );
    } catch (error) {
      console.error("Account update error:", error);

      Alert.alert(
        "Update Failed",
        "Could not update your account information. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

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
          Account Information
        </Text>
      </View>

      <View className="px-5 pt-7">
        {/* Profile */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center">
            {user.imageUrl ? (
              <View className="w-24 h-24 rounded-full overflow-hidden">
                <View className="flex-1">
                  <Text className="text-3xl text-blue-600 text-center mt-7">
                    {firstNameValue?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="text-3xl font-bold text-blue-600">
                {firstNameValue?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            )}
          </View>

          <Text className="text-lg font-bold text-gray-800 mt-4">
            {firstNameValue} {lastNameValue}
          </Text>
        </View>

        {/* First Name */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          First Name
        </Text>

        <TextInput
          value={firstNameValue}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-800 mb-5"
        />

        {/* Last Name */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Last Name
        </Text>

        <TextInput
          value={lastNameValue}
          onChangeText={setLastName}
          placeholder="Enter last name"
          placeholderTextColor="#9CA3AF"
          className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-800 mb-5"
        />

        {/* Email */}
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </Text>

        <View className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center">
          <Text className="flex-1 text-gray-500">
            {email}
          </Text>

          <Ionicons
            name="lock-closed-outline"
            size={18}
            color="#9CA3AF"
          />
        </View>

        <Text className="text-xs text-gray-400 mt-2">
          Email address is managed by your authentication account.
        </Text>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`mt-8 py-4 rounded-2xl items-center ${
            saving ? "bg-blue-300" : "bg-blue-600"
          }`}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}