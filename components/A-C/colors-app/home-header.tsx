import React, { FC } from "react";

import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable, View, Text, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Home, Sun } from "lucide-react-native";

// colorsapp-home-header-animation 🔽

const Base_Header_Max_Height = 210;
const Base_Header_Min_Height = 50;
export const Scroll_Distance = Base_Header_Max_Height - Base_Header_Min_Height;

type Props = { scrollOffsetY: SharedValue<number> };

export const HomeHeader: FC<Props> = ({ scrollOffsetY }) => {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top;
  const paddingBottom = 12;

  const Header_Max_Height = Base_Header_Max_Height + paddingTop + paddingBottom;
  const Header_Min_Height = Base_Header_Min_Height + paddingTop + paddingBottom;
  const Scroll_Distance = Header_Max_Height - Header_Min_Height;

  const animatedHeaderContainer = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffsetY.value,
      [0, Scroll_Distance * 2],
      [Header_Max_Height, Header_Min_Height],
      Extrapolation.CLAMP
    ),
    backgroundColor: interpolateColor(
      scrollOffsetY.value,
      [0, Scroll_Distance * 2],
      ["#231E2B", "#1B1721"]
    ),
  }));

  const animatedTranslateContainer = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffsetY.value,
          [0, Scroll_Distance * 2],
          [0, -Scroll_Distance],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const animatedOpacityContainer = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffsetY.value,
      [0, Scroll_Distance * 2],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View
      className="px-4 overflow-hidden"
      style={[{ paddingTop: insets.top + 8 }, animatedHeaderContainer]}
    >
      <Animated.View style={animatedTranslateContainer}>
        <Animated.View style={animatedOpacityContainer}>
          <View className="flex-row flex-wrap items-center justify-between mb-[30]">
            <Text className="font-p-sb text-lg text-neutral-300">👋 Hello</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-neutral-300">Explore more</Text>
              <Pressable
                className="p-2 rounded-full bg-pink-400"
                onPress={() => Alert.alert("Home")}
              >
                <Home size={20} color="black" strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
          <Text className="text-2xl font-bold text-neutral-300">Welcome to your</Text>
          <Text className="text-2xl font-bold mb-5 text-neutral-300">app colors playground!</Text>
          <View className="h-px w-full opacity-20 my-3 bg-neutral-500" />
        </Animated.View>
        <View className="flex-row items-center">
          <Pressable
            className="p-3 rounded-full border border-neutral-600"
            onPress={() => Alert.alert("Change theme")}
          >
            <Sun size={14} color="white" />
          </Pressable>
          <View className="w-2" />
          <Pressable
            className="py-3 px-4 rounded-full bg-neutral-700/50"
            onPress={() => Alert.alert("Set colors")}
          >
            <Text className="text-neutral-300">Set colors</Text>
          </Pressable>
        </View>
        <View style={{ height: paddingBottom }} />
      </Animated.View>
    </Animated.View>
  );
};

// colorsapp-home-header-animation 🔼
