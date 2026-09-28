import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NOTIFICATIONS_KEY = "dreamhouse_notifications_enabled";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedValue = await AsyncStorage.getItem(NOTIFICATIONS_KEY);

      if (savedValue !== null) {
        setNotificationsEnabled(savedValue === "true");
      }
    } catch (error) {
      console.error("Load settings error:", error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      setNotificationsEnabled(value);

      await AsyncStorage.setItem(
        NOTIFICATIONS_KEY,
        value.toString()
      );
    } catch (error) {
      console.error("Save notification setting error:", error);

      setNotificationsEnabled(!value);

      Alert.alert(
        "Error",
        "Could not save notification preference."
      );
    }
  };

  if (!isLoaded || loadingSettings) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

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
          Settings
        </Text>
      </View>

      <View className="px-5 pt-6">
        {/* Account */}
        <Text className="text-sm font-semibold text-gray-400 uppercase mb-3">
          Account
        </Text>

        <SettingItem
          icon="person-outline"
          title="Account Information"
          subtitle={
            user?.emailAddresses?.[0]?.emailAddress ||
            "Manage your account"
          }
          onPress={() => router.push("/settings/account")}
        />

        {/* Preferences */}
        <Text className="text-sm font-semibold text-gray-400 uppercase mt-7 mb-3">
          Preferences
        </Text>

        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4">
          <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center">
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#2563EB"
            />
          </View>

          <View className="flex-1 ml-4">
            <Text className="text-base font-semibold text-gray-800">
              Notifications
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              Receive DreamHouse notifications
            </Text>
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{
              false: "#D1D5DB",
              true: "#93C5FD",
            }}
            thumbColor={
              notificationsEnabled ? "#2563EB" : "#F3F4F6"
            }
          />
        </View>

        {/* Information */}
        <Text className="text-sm font-semibold text-gray-400 uppercase mt-7 mb-3">
          Information
        </Text>

        <SettingItem
          icon="information-circle-outline"
          title="About DreamHouse"
          subtitle="Learn more about the app"
          onPress={() => router.push("/settings/about")}
        />

        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          subtitle="How we handle your information"
          onPress={() => router.push("/settings/privacy")}
        />

        <SettingItem
          icon="document-text-outline"
          title="Terms & Conditions"
          subtitle="Read our terms of service"
          onPress={() => router.push("/settings/terms")}
        />
      </View>

      {/* App Version */}
      <View className="mt-auto items-center pb-8">
        <Text className="text-gray-400 text-sm">
          DreamHouse
        </Text>

        <Text className="text-gray-300 text-xs mt-1">
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 mb-3"
      activeOpacity={0.7}
    >
      <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center">
        <Ionicons
          name={icon}
          size={22}
          color="#2563EB"
        />
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-gray-800">
          {title}
        </Text>

        <Text className="text-sm text-gray-500 mt-1">
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9CA3AF"
      />
    </TouchableOpacity>
  );
}