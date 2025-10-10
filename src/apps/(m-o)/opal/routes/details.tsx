import { View, Pressable, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Switcher from "../components/switcher";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurListItem from "../components/blur-list-item";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 8;

export const Details = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [value, setValue] = useState<"schedule" | "timer">("schedule");

  return (
    <View className="flex-1">
      <Image
        style={StyleSheet.absoluteFill}
        placeholder={{
          blurhash:
            "i8A9$u$K0L~V%g57s.?HR+S5s:-T$$V@WCxbNHNH0zxv?GIosm-pNGNGxGNHxat7NIozofaxs.R+aeoLs:s:a|ofoLaxs.",
        }}
      />
      <Pressable
        onPress={() => router.back()}
        className="absolute top-[80px] left-4 rounded-full p-2 overflow-hidden bg-neutral-700/50"
      >
        <ChevronDown size={20} color="white" strokeWidth={3} />
      </Pressable>

      <LinearGradient
        colors={["transparent", "rgba(48,43,35,0.95)", "black"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View className="mt-auto" />
      <Switcher value={value} setValue={setValue} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 0,
          paddingHorizontal: HORIZONTAL_PADDING,
          gap: 2 * HORIZONTAL_PADDING,
          marginBottom: insets.bottom,
        }}
        style={{ flexGrow: 0 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        <View
          key="one"
          style={[{ width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2, padding: HORIZONTAL_PADDING }]}
        >
          <BlurListItem count={7} borderClass="border border-neutral-300/30" intensity={8} />

          <View className="bg-white rounded-full py-3 mt-4 items-center">
            <Text className="text-black text-lg font-bold">Save</Text>
          </View>
        </View>

        <View
          className="mt-auto"
          key="two"
          style={{ width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2, padding: HORIZONTAL_PADDING }}
        >
          <BlurListItem count={4} borderClass="border border-neutral-400/30" intensity={8} />

          <View className="bg-white rounded-full py-3 mt-4 items-center">
            <Text className="text-black text-lg font-bold">Start Timer</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
