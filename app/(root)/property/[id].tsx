import PropertyMap from "@/components/PropertyMap";
import { useSavedProperty } from "@/hooks/useSavedProperty";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ADMIN_PHONE = "01306575021";

/* ============================================================
   NORMALIZE IMAGES
============================================================ */

const normalizeImages = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0
    );
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0
        );
      }
    } catch {
      // Treat as a single URL.
    }

    return [trimmed];
  }

  return [];
};

/* ============================================================
   PROPERTY DETAIL SCREEN
============================================================ */

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const router = useRouter();

  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const [expanded, setExpanded] = useState(false);

  const [imageViewerVisible, setImageViewerVisible] =
    useState(false);

  const fullscreenListRef =
    useRef<FlatList<string>>(null);

  const {
    isSaved,
    saveLoading,
    toggleSave,
  } = useSavedProperty(id ?? "");

  const authSupabase = useSupabase();

  /* ==========================================================
     IMAGES
  ========================================================== */

  const images = property
    ? normalizeImages(property.images)
    : [];

  /* ==========================================================
     FETCH PROPERTY
  ========================================================== */

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(
          "Fetch property error:",
          error
        );

        Alert.alert(
          "Error",
          "Could not load this property."
        );

        setProperty(null);
        return;
      }

      setProperty(data as Property);

      setActiveIndex(0);
      setFullscreenIndex(0);
    } catch (error) {
      console.error(
        "Fetch property exception:",
        error
      );

      Alert.alert(
        "Error",
        "Something went wrong while loading the property."
      );

      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     OPEN FULLSCREEN IMAGE
  ========================================================== */

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setActiveIndex(index);
    setImageViewerVisible(true);

    setTimeout(() => {
      fullscreenListRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    }, 100);
  };

  /* ==========================================================
     MAIN IMAGE SLIDER
  ========================================================== */

  const onMainSliderScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (images.length === 0) {
      return;
    }

    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    const safeIndex = Math.max(
      0,
      Math.min(index, images.length - 1)
    );

    setActiveIndex(safeIndex);
  };

  /* ==========================================================
     FULLSCREEN SLIDER
  ========================================================== */

  const onFullscreenScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (images.length === 0) {
      return;
    }

    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    const safeIndex = Math.max(
      0,
      Math.min(index, images.length - 1)
    );

    setFullscreenIndex(safeIndex);
    setActiveIndex(safeIndex);
  };

  /* ==========================================================
     DELETE PROPERTY
  ========================================================== */

  const handleDelete = () => {
    if (!id || !property) {
      return;
    }

    Alert.alert(
      "Delete Property",
      `Are you sure you want to permanently delete "${property.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              setActionLoading(true);

              const { error } = await authSupabase
                .from("properties")
                .delete()
                .eq("id", id);

              if (error) {
                console.error(
                  "Delete property error:",
                  error
                );

                Alert.alert(
                  "Delete Failed",
                  error.message ||
                    "Could not delete this property."
                );

                return;
              }

              Alert.alert(
                "Success",
                "Property deleted successfully.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      router.replace(
                        "/(root)/(tabs)" as any
                      );
                    },
                  },
                ]
              );
            } catch (error) {
              console.error(
                "Delete property exception:",
                error
              );

              Alert.alert(
                "Error",
                "Something went wrong while deleting the property."
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  /* ==========================================================
     MARK SOLD / MAKE AVAILABLE
  ========================================================== */

  const handleToggleSold = () => {
    if (!id || !property) {
      return;
    }

    const nextSoldState = !property.is_sold;

    const alertTitle = nextSoldState
      ? "Mark as Sold"
      : "Mark as Available";

    const alertMessage = nextSoldState
      ? `Are you sure you want to mark "${property.title}" as sold?`
      : `Do you want to make "${property.title}" available again?`;

    Alert.alert(
      alertTitle,
      alertMessage,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: nextSoldState
            ? "Mark Sold"
            : "Make Available",

          onPress: async () => {
            try {
              setActionLoading(true);

              const { data, error } = await authSupabase
                .from("properties")
                .update({
                  is_sold: nextSoldState,
                })
                .eq("id", id)
                .select()
                .single();

              if (error) {
                console.error(
                  "Update sold state error:",
                  error
                );

                Alert.alert(
                  "Update Failed",
                  error.message ||
                    "Could not update property status."
                );

                return;
              }

              setProperty(data as Property);

              Alert.alert(
                "Success",
                nextSoldState
                  ? "Property has been marked as sold."
                  : "Property is available again."
              );
            } catch (error) {
              console.error(
                "Update sold state exception:",
                error
              );

              Alert.alert(
                "Error",
                "Something went wrong while updating the property."
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  /* ==========================================================
     CONTACT AGENT
  ========================================================== */

  const handleContact = async () => {
    if (!property) {
      return;
    }

    const message =
      `Hi! I'm interested in the property: ${property.title}`;

    const whatsappUrl =
      `https://wa.me/${ADMIN_PHONE}` +
      `?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      console.error(
        "WhatsApp error:",
        error
      );

      Alert.alert(
        "WhatsApp Error",
        "Could not open WhatsApp."
      );
    }
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />

          <Text className="mt-3 text-gray-500">
            Loading property...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ==========================================================
     PROPERTY NOT FOUND
  ========================================================== */

  if (!property) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="home-outline"
            size={64}
            color="#9CA3AF"
          />

          <Text className="mt-4 text-xl font-bold text-gray-800">
            Property Not Found
          </Text>

          <Text className="mt-2 text-center text-gray-500">
            This property may have been deleted
            or is no longer available.
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-xl bg-black px-6 py-3"
          >
            <Text className="font-semibold text-white">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ==========================================================
     MAP COORDINATES
  ========================================================== */

  const latitude = Number(
    String(property.latitude ?? "").trim()
  );

  // IMPORTANT:
  // Database column is "longitude"
  const longitude = Number(
    String(property.longitude ?? "").trim()
  );

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude !== 0 &&
    longitude !== 0;

  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=` +
      `${longitude - 0.005}%2C` +
      `${latitude - 0.005}%2C` +
      `${longitude + 0.005}%2C` +
      `${latitude + 0.005}` +
      `&layer=mapnik` +
      `&marker=${latitude}%2C${longitude}`
    : "";

  const mapLink = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
    : "";

  /* ==========================================================
     DESCRIPTION
  ========================================================== */

  const isLongDesc =
    (property.description?.length ?? 0) > 150;

  const displayDesc =
    expanded || !isLongDesc
      ? property.description
      : property.description?.slice(0, 150) + "...";

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        {/* ====================================================
            IMAGE SLIDER
        ==================================================== */}

        <View className="relative">
          <View
            style={{
              opacity: property.is_sold ? 0.5 : 1,
            }}
          >
            {images.length > 0 ? (
              <FlatList
                data={images}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) =>
                  `property-image-${index}-${item}`
                }
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.95}
                    onPress={() =>
                      openFullscreen(index)
                    }
                  >
                    <Image
                      source={{
                        uri: item,
                      }}
                      style={{
                        width,
                        height: 300,
                      }}
                      resizeMode="cover"
                      onError={(event) => {
                        console.log(
                          "Image loading error:",
                          item,
                          event.nativeEvent
                        );
                      }}
                    />
                  </TouchableOpacity>
                )}
                onMomentumScrollEnd={
                  onMainSliderScrollEnd
                }
                initialNumToRender={1}
                windowSize={3}
              />
            ) : (
              <View
                className="items-center justify-center bg-gray-100"
                style={{
                  width,
                  height: 300,
                }}
              >
                <Ionicons
                  name="image-outline"
                  size={60}
                  color="#9CA3AF"
                />

                <Text className="mt-3 text-gray-500">
                  No images available
                </Text>
              </View>
            )}
          </View>

          {/* TOP BUTTONS */}

          <SafeAreaView
            className="absolute left-0 right-0 top-0"
            edges={["top"]}
          >
            <View className="flex-row items-center justify-between px-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
              >
                {saveLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="white"
                  />
                ) : (
                  <Ionicons
                    name={
                      isSaved
                        ? "heart"
                        : "heart-outline"
                    }
                    size={24}
                    color={
                      isSaved
                        ? "#EF4444"
                        : "white"
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* SOLD BADGE */}

          {property.is_sold && (
            <View className="absolute bottom-5 left-5 rounded-lg bg-red-600 px-4 py-2">
              <Text className="font-bold text-white">
                SOLD
              </Text>
            </View>
          )}

          {/* IMAGE COUNTER */}

          {images.length > 0 && (
            <View className="absolute bottom-5 right-5 rounded-full bg-black/70 px-3 py-1.5">
              <Text className="font-semibold text-white">
                {activeIndex + 1} / {images.length}
              </Text>
            </View>
          )}

          {/* IMAGE DOTS */}

          {images.length > 1 && (
            <View className="absolute bottom-2 left-0 right-0 flex-row items-center justify-center">
              {images.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  className={`mx-1 h-2 rounded-full ${
                    activeIndex === index
                      ? "w-5 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* ====================================================
            PROPERTY CONTENT
        ==================================================== */}

        <View className="px-5 pt-5">
          {/* TYPE */}

          {property.type && (
            <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {property.type}
            </Text>
          )}

          {/* TITLE */}

          <Text className="text-2xl font-bold text-gray-900">
            {property.title}
          </Text>

          {/* PRICE */}

          <Text className="mt-2 text-2xl font-bold text-green-600">
            {formatPrice(property.price)}
          </Text>

          {/* LOCATION */}

          <View className="mt-3 flex-row items-start">
            <Ionicons
              name="location-outline"
              size={20}
              color="#6B7280"
            />

            <View className="ml-2 flex-1">
              <Text className="text-base text-gray-600">
                {property.address}
              </Text>

              {property.city && (
                <Text className="mt-1 text-sm text-gray-500">
                  {property.city}
                </Text>
              )}
            </View>
          </View>

          {/* PROPERTY SPECS */}

          <View className="mt-6 flex-row flex-wrap">
            <SpecItem
              icon="bed-outline"
              label="Bedrooms"
              value={`${property.bedrooms}`}
            />

            <SpecItem
              icon="water-outline"
              label="Bathrooms"
              value={`${property.bathrooms}`}
            />

            <SpecItem
              icon="resize-outline"
              label="Area"
              value={`${property.area_sqft} sqft`}
            />
          </View>

          {/* DESCRIPTION */}

          <View className="mt-7">
            <Text className="text-xl font-bold text-gray-900">
              Description
            </Text>

            <Text className="mt-3 leading-6 text-gray-600">
              {displayDesc ||
                "No description available."}
            </Text>

            {isLongDesc && (
              <TouchableOpacity
                onPress={() =>
                  setExpanded(!expanded)
                }
                className="mt-2"
              >
                <Text className="font-semibold text-green-600">
                  {expanded
                    ? "Show Less"
                    : "Read More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ==================================================
              LOCATION / MAP
          ================================================== */}

          <View className="mt-7">
            <Text className="mb-3 text-xl font-bold text-gray-900">
              Location
            </Text>

            {hasCoordinates ? (
              <PropertyMap
                mapUrl={mapUrl}
                mapLink={mapLink}
              />
            ) : (
              <View
                className="items-center justify-center rounded-2xl bg-gray-100"
                style={{
                  height: 180,
                }}
              >
                <Ionicons
                  name="map-outline"
                  size={45}
                  color="#9CA3AF"
                />

                <Text className="mt-3 text-center text-gray-500">
                  Map location is not available.
                </Text>

                <Text className="mt-2 text-xs text-gray-400">
                  Latitude: {String(property.latitude)}
                </Text>

                <Text className="text-xs text-gray-400">
                  Longitude: {String(property.longitude)}
                </Text>
              </View>
            )}

            {/* ADDRESS */}

            {property.address && (
              <View className="mt-3 flex-row items-start">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#6B7280"
                />

                <Text className="ml-2 flex-1 leading-6 text-gray-600">
                  {property.address}
                  {property.city
                    ? `, ${property.city}`
                    : ""}
                </Text>
              </View>
            )}
          </View>

          {/* CONTACT AGENT */}

          {!property.is_sold && (
            <TouchableOpacity
              onPress={handleContact}
              className="mt-7 flex-row items-center justify-center rounded-2xl bg-green-600 py-4"
            >
              <Ionicons
                name="logo-whatsapp"
                size={23}
                color="white"
              />

              <Text className="ml-2 text-base font-bold text-white">
                Contact Agent
              </Text>
            </TouchableOpacity>
          )}

          {/* ADMIN ACTIONS */}

          {isAdmin && (
            <View className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <View className="mb-4 flex-row items-center">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#111827"
                />

                <Text className="ml-2 text-lg font-bold text-gray-900">
                  Admin Actions
                </Text>
              </View>

              {/* MARK SOLD / AVAILABLE */}

              <TouchableOpacity
                onPress={handleToggleSold}
                disabled={actionLoading}
                className={`mb-3 flex-row items-center justify-center rounded-xl py-4 ${
                  property.is_sold
                    ? "bg-blue-600"
                    : "bg-orange-500"
                }`}
              >
                {actionLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons
                      name={
                        property.is_sold
                          ? "checkmark-circle-outline"
                          : "pricetag-outline"
                      }
                      size={22}
                      color="white"
                    />

                    <Text className="ml-2 font-bold text-white">
                      {property.is_sold
                        ? "Mark as Available"
                        : "Mark as Sold"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* DELETE */}

              <TouchableOpacity
                onPress={handleDelete}
                disabled={actionLoading}
                className="flex-row items-center justify-center rounded-xl bg-red-600 py-4"
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color="white"
                />

                <Text className="ml-2 font-bold text-white">
                  Delete Property
                </Text>
              </TouchableOpacity>

              <Text className="mt-3 text-center text-xs leading-5 text-gray-500">
                Mark as Sold changes only the
                property status. Delete Property
                permanently removes the property.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ======================================================
          FULLSCREEN IMAGE VIEWER
      ====================================================== */}

      <Modal
        visible={imageViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() =>
          setImageViewerVisible(false)
        }
      >
        <View className="flex-1 bg-black">
          {/* TOP BAR */}

          <SafeAreaView
            className="absolute left-0 right-0 top-0 z-10"
            edges={["top"]}
          >
            <View className="flex-row items-center justify-between px-4">
              <TouchableOpacity
                onPress={() =>
                  setImageViewerVisible(false)
                }
                className="h-11 w-11 items-center justify-center rounded-full bg-white/20"
              >
                <Ionicons
                  name="close"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>

              <View className="rounded-full bg-white/20 px-4 py-2">
                <Text className="font-semibold text-white">
                  {fullscreenIndex + 1} /{" "}
                  {images.length}
                </Text>
              </View>
            </View>
          </SafeAreaView>

          {/* FULLSCREEN SLIDER */}

          {images.length > 0 && (
            <FlatList
              ref={fullscreenListRef}
              data={images}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) =>
                `fullscreen-${index}-${item}`
              }
              renderItem={({ item }) => (
                <View
                  style={{
                    width,
                    height,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: item,
                    }}
                    style={{
                      width,
                      height: height * 0.8,
                    }}
                    resizeMode="contain"
                  />
                </View>
              )}
              getItemLayout={(_data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={
                onFullscreenScrollEnd
              }
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  fullscreenListRef.current?.scrollToIndex(
                    {
                      index: Math.min(
                        info.index,
                        images.length - 1
                      ),
                      animated: false,
                    }
                  );
                }, 100);
              }}
              initialNumToRender={1}
              windowSize={3}
            />
          )}

          {/* FULLSCREEN DOTS */}

          {images.length > 1 && (
            <SafeAreaView
              className="absolute bottom-0 left-0 right-0"
              edges={["bottom"]}
            >
              <View className="mb-4 flex-row items-center justify-center">
                {images.map((_, index) => (
                  <View
                    key={`fullscreen-dot-${index}`}
                    className={`mx-1 h-2 rounded-full ${
                      fullscreenIndex === index
                        ? "w-6 bg-white"
                        : "w-2 bg-white/40"
                    }`}
                  />
                ))}
              </View>
            </SafeAreaView>
          )}
        </View>
      </Modal>
    </View>
  );
}

/* ============================================================
   SPEC ITEM
============================================================ */

type SpecItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function SpecItem({
  icon,
  label,
  value,
}: SpecItemProps) {
  return (
    <View className="mb-3 mr-3 min-w-[45%] flex-1 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          size={22}
          color="#4B5563"
        />

        <Text className="ml-2 text-sm text-gray-500">
          {label}
        </Text>
      </View>

      <Text className="mt-2 text-base font-bold text-gray-900">
        {value}
      </Text>
    </View>
  );
}