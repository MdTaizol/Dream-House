import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

type PropertyMapProps = {
  mapUrl: string;
  mapLink: string;
};

export default function PropertyMap({
  mapUrl,
}: PropertyMapProps) {
  return (
    <View
      className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
      style={{
        height: 230,
      }}
    >
      <WebView
        source={{
          uri: mapUrl,
        }}
        style={{
          flex: 1,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-gray-100">
            <ActivityIndicator size="large" />
          </View>
        )}
        onError={(event) => {
          console.log(
            "Property map error:",
            event.nativeEvent
          );
        }}
      />
    </View>
  );
}