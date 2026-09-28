import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  // ================================
  // UPDATE PROFILE IMAGE
  // ================================

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.base64) {
        Alert.alert(
          "Error",
          "Could not read the selected image."
        );
        return;
      }

      setIsUpdating(true);

      const base64Image = asset.base64;

      const uri = asset.uri;

      const filename =
        uri.split("/").pop() || "profile.jpg";

      const match = /\.(\w+)$/.exec(filename);

      const extension = match
        ? match[1].toLowerCase()
        : "jpeg";

      const mimeType =
        extension === "png"
          ? "image/png"
          : "image/jpeg";

      const dataUrl =
        `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({
        file: dataUrl,
      });

      // Refresh Clerk user data
      await user?.reload();

      Alert.alert(
        "Success",
        "Profile picture updated successfully!"
      );
    } catch (error) {
      console.error(
        "Profile image update error:",
        error
      );

      Alert.alert(
        "Update Failed",
        "Could not update your profile picture. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ================================
  // SIGN OUT
  // ================================

  const handleSignOut = async () => {
    try {
      await signOut();

      router.replace("/sign-in");
    } catch (error) {
      console.error(
        "Error signing out:",
        error
      );

      Alert.alert(
        "Error",
        "Could not sign out. Please try again."
      );
    }
  };

  // ================================
  // HELP & SUPPORT
  // ================================

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Need help with the DreamHouse app?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send Email",
          onPress: async () => {
            const email =
              "taizolislam41@gmail.com";

            const subject =
              "DreamHouse - Help & Support";

            const body =
              "Hello DreamHouse Support,\n\nI need help with:\n\n";

            const url =
              `mailto:${email}?subject=${encodeURIComponent(
                subject
              )}&body=${encodeURIComponent(body)}`;

            const supported =
              await Linking.canOpenURL(url);

            if (supported) {
              await Linking.openURL(url);
            } else {
              Alert.alert(
                "Email Not Available",
                `Please email us at ${email}`
              );
            }
          },
        },
      ]
    );
  };

  // ================================
  // LOADING
  // ================================

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />
      </SafeAreaView>
    );
  }

  // ================================
  // PROFILE UI
  // ================================

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Avatar + Name */}

      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{
              uri: user.imageUrl,
            }}
            className="w-24 h-24 rounded-full"
          />

          {/* Camera Button */}

          <TouchableOpacity
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
            className="absolute bottom-2 right-0 bg-blue-600 rounded-full p-2"
            style={{
              elevation: 3,
            }}
          >
            {isUpdating ? (
              <ActivityIndicator
                size="small"
                color="white"
              />
            ) : (
              <Ionicons
                name="camera"
                size={16}
                color="white"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Name */}

        <Text className="text-xl font-bold text-gray-800 mt-4">
          {user.firstName} {user.lastName}
        </Text>

        {/* Email */}

        <Text className="text-gray-500 mt-1">
          {user.emailAddresses[0]?.emailAddress}
        </Text>
      </View>

      {/* Menu Items */}

      <View className="px-6 gap-2">
        {/* Saved Properties */}

        <MenuItem
          icon="heart-outline"
          label="Saved Properties"
          onPress={() =>
            router.push(
              "/(root)/(tabs)/saved"
            )
          }
        />

        {/* Notifications */}

        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() =>
            Alert.alert(
              "Notifications",
              "Notification system is not available yet."
            )
          }
        />

        {/* Settings */}

        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() =>
            Alert.alert(
              "Settings",
              "Settings page is coming soon."
            )
          }
        />

        {/* Help & Support */}

        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={handleHelpSupport}
        />
      </View>

      {/* Sign Out */}

      <View className="px-6 mt-auto mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#EF4444"
          />

          <Text className="text-red-500 font-semibold text-base">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ====================================
// MENU ITEM
// ====================================

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl"
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={22}
        color="#6B7280"
      />

      <Text className="flex-1 text-gray-700 font-medium text-base">
        {label}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#D1D5DB"
      />
    </TouchableOpacity>
  );
}

