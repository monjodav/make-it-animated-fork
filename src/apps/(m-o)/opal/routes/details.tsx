import { View, Pressable, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Switcher from "../components/switcher";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurListItem from "../components/blur-list-item";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 8;

export const Details = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [value, setValue] = useState<"schedule" | "timer">("schedule");
  const scrollRef = useRef<ScrollView>(null);

  const pageWidth = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
  const gap = 2 * HORIZONTAL_PADDING;
  const getOffsetForIndex = (i: number) => i * (pageWidth + gap);
  const goToIndex = (i: number, animated = true) => {
    scrollRef.current?.scrollTo({ x: getOffsetForIndex(i), y: 0, animated });
  };

  useEffect(() => {
    const initialIndex = value === "schedule" ? 0 : 1;
    requestAnimationFrame(() => goToIndex(initialIndex, false));
  }, []);

  return (
    <View className="flex-1">
      <Image
        style={StyleSheet.absoluteFill}
        placeholder={{
          blurhash:
            "i8A9$u$K0L~V%g57s.?HR+S5s:-T$$V@WCxbNHNH0zxv?GIosm-pNGNGxGNHxat7NIozofaxs.R+aeoLs:s:a|ofoLaxs.",
        }}
      />

      <LinearGradient
        colors={["transparent", "rgba(48,43,35,0.95)", "black"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          position: "absolute",
          bottom: insets.bottom,
          paddingHorizontal: HORIZONTAL_PADDING,
          gap: 2 * HORIZONTAL_PADDING,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEnabled={false}
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

      <Pressable
        onPress={() => router.back()}
        className="absolute top-[80px] left-4 rounded-full p-2 overflow-hidden bg-neutral-700/50"
      >
        <ChevronDown size={20} color="white" strokeWidth={3} />
      </Pressable>

      <View className="absolute bottom-[600] left-0 right-0">
        <Switcher
          value={value}
          setValue={(v) => {
            setValue(v);
            const i = v === "schedule" ? 0 : 1;
            goToIndex(i);
          }}
        />
      </View>
    </View>
  );
};
