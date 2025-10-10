import { View, Pressable, Text, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Switcher from "../components/switcher";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurListItem from "../components/blur-list-item";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  useDerivedValue,
  withTiming,
  Easing,
  scrollTo,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 8;

const PAGE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const GAP = 2 * HORIZONTAL_PADDING;
const PAGE_STRIDE = PAGE_WIDTH + GAP;

const BOTTOM_SWITCHER_POSITION = 20;

export const Details = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const [value, setValue] = useState<"schedule" | "timer">("schedule");

  const page = useSharedValue(0);

  const firstTopY = useSharedValue(0);
  const secondTopY = useSharedValue(0);
  const containerH = useSharedValue(0);

  useDerivedValue(() => {
    console.log("firstTopY", firstTopY.value);
    console.log("secondTopY", secondTopY.value);
    console.log("containerH", containerH.value);
  });

  const goToIndex = (i: number) => {
    page.value = withTiming(i, { duration: 350, easing: Easing.out(Easing.cubic) });
  };

  useEffect(() => {
    const initialIndex = value === "schedule" ? 0 : 1;
    page.value = initialIndex;
  }, []);

  useDerivedValue(() => {
    scrollTo(scrollRef, page.value * PAGE_STRIDE, 0, false);
  });

  const rSwitcherStyle = useAnimatedStyle(() => {
    const interpolatedTop = interpolate(page.value, [0, 1], [firstTopY.value, secondTopY.value]);

    const desiredTop = interpolatedTop - BOTTOM_SWITCHER_POSITION;

    const bottom = Math.max(0, containerH.value - desiredTop);
    return { bottom };
  });

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

      <View
        style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom }}
        onLayout={(e) => {
          containerH.value = e.nativeEvent.layout.height;
        }}
      >
        <Animated.ScrollView
          ref={scrollRef}
          style={{ maxHeight: "100%" }}
          contentContainerStyle={{
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
            style={[
              {
                width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2,
                padding: HORIZONTAL_PADDING,
              },
            ]}
            onLayout={(e: LayoutChangeEvent) => (firstTopY.value = e.nativeEvent.layout.y)}
          >
            <BlurListItem count={7} borderClass="border border-neutral-300/30" intensity={8} />

            <View className="bg-white rounded-full py-3 mt-4 items-center">
              <Text className="text-black text-lg font-bold">Save</Text>
            </View>
          </View>

          <View
            className="mt-auto"
            key="two"
            style={{
              width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2,
              padding: HORIZONTAL_PADDING,
            }}
            onLayout={(e: LayoutChangeEvent) => (secondTopY.value = e.nativeEvent.layout.y)}
          >
            <BlurListItem count={4} borderClass="border border-neutral-400/30" intensity={8} />

            <View className="bg-white rounded-full py-3 mt-4 items-center">
              <Text className="text-black text-lg font-bold">Start Timer</Text>
            </View>
          </View>
        </Animated.ScrollView>

        <Animated.View style={[rSwitcherStyle, { position: "absolute", left: 0, right: 0 }]}>
          <Switcher
            value={value}
            setValue={(v) => {
              setValue(v);
              const i = v === "schedule" ? 0 : 1;
              goToIndex(i);
            }}
          />
        </Animated.View>
      </View>

      <Pressable
        onPress={() => router.back()}
        className="absolute top-[80px] left-4 rounded-full p-2 overflow-hidden bg-neutral-700/50"
      >
        <ChevronDown size={20} color="white" strokeWidth={3} />
      </Pressable>
    </View>
  );
};
