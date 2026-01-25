import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

type CarouselItemProps = {
  item: {
    id: string;
    blurhash: string;
  };
  width: number;
};

export const CarouselItem = ({ item, width }: CarouselItemProps) => {
  return (
    <View style={[{ width, height: 550 }, styles.borderCurve]} className="px-6">
      <View className="flex-1 rounded-[50px] overflow-hidden bg-red-200">
        <Image
          placeholder={{
            blurhash: item.blurhash,
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          contentFit="cover"
        />
        <View className="p-6 mt-auto">
          <Text className="text-white font-bold text-4xl">446,478</Text>
          <Text className="text-white font-bold text-lg">Steps</Text>
          <Text className="text-white text-xs">225.2mi using GO since Sep 15,2025</Text>
          <View className="flex-row justify-between mt-8 mb-6">
            <View className="rounded-[5px] bg-white/50 h-14 w-28" />
            <View className="rounded-full bg-white/50 h-14 w-20" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: { borderCurve: "continuous" },
});