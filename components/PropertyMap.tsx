import { View } from "react-native";

type PropertyMapProps = {
  mapUrl: string;
  mapLink: string;
};

export default function PropertyMap({
  mapUrl,
  mapLink,
}: PropertyMapProps) {
  return (
    <View
      style={{
        height: 230,
      }}
    />
  );
}