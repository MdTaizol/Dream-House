
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  time: string;
  read: boolean;
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Welcome to DreamHouse",
    message:
      "Start exploring properties and find your perfect home.",
    icon: "home-outline",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    title: "Explore New Properties",
    message:
      "New properties may be available in your area.",
    icon: "notifications-outline",
    time: "Today",
    read: false,
  },
];

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(
          "dreamhouse_notifications"
        );

      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);

        await AsyncStorage.setItem(
          "dreamhouse_notifications",
          JSON.stringify(DEFAULT_NOTIFICATIONS)
        );
      }
    } catch (error) {
      console.error(
        "Load notifications error:",
        error
      );

      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  };

  const saveNotifications = async (
    data: NotificationItem[]
  ) => {
    try {
      await AsyncStorage.setItem(
        "dreamhouse_notifications",
        JSON.stringify(data)
      );
    } catch (error) {
      console.error(
        "Save notifications error:",
        error
      );
    }
  };

  const handleNotificationPress = async (
    id: string
  ) => {
    const updated = notifications.map(
      (notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

    setNotifications(updated);
    await saveNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = notifications.map(
      (notification) => ({
        ...notification,
        read: true,
      })
    );

    setNotifications(updated);
    await saveNotifications(updated);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear Notifications",
      "Are you sure you want to clear all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setNotifications([]);
            await AsyncStorage.removeItem(
              "dreamhouse_notifications"
            );
          },
        },
      ]
    );
  };

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#374151"
          />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-xl font-bold text-gray-800 mr-10">
          Notifications
        </Text>
      </View>

      {/* Actions */}
      {notifications.length > 0 && (
        <View className="flex-row justify-between px-5 py-4">
          <Text className="text-gray-500">
            {unreadCount} unread
          </Text>

          <View className="flex-row gap-5">
            <TouchableOpacity
              onPress={handleMarkAllRead}
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 font-semibold">
                Mark all read
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <Text className="text-red-500 font-semibold">
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          flexGrow: 1,
        }}
      >
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-32">
            <View className="w-20 h-20 rounded-full bg-blue-50 items-center justify-center">
              <Ionicons
                name="notifications-off-outline"
                size={38}
                color="#3B82F6"
              />
            </View>

            <Text className="text-xl font-bold text-gray-800 mt-5">
              No Notifications
            </Text>

            <Text className="text-gray-500 text-center mt-2 px-8 leading-5">
              You're all caught up. New notifications
              will appear here.
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              onPress={() =>
                handleNotificationPress(
                  notification.id
                )
              }
              activeOpacity={0.7}
              className={`flex-row p-4 rounded-2xl mb-3 ${
                notification.read
                  ? "bg-gray-50"
                  : "bg-blue-50"
              }`}
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  notification.read
                    ? "bg-gray-100"
                    : "bg-white"
                }`}
              >
                <Ionicons
                  name={notification.icon}
                  size={24}
                  color="#3B82F6"
                />
              </View>

              <View className="flex-1 ml-4">
                <View className="flex-row items-center">
                  <Text className="flex-1 text-base font-bold text-gray-800">
                    {notification.title}
                  </Text>

                  {!notification.read && (
                    <View className="w-2.5 h-2.5 rounded-full bg-blue-600 ml-2" />
                  )}
                </View>

                <Text className="text-gray-600 mt-1 leading-5">
                  {notification.message}
                </Text>

                <Text className="text-gray-400 text-xs mt-2">
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

