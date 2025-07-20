import React from "react";
import { Alert, Text } from "react-native";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import { ChevronRight } from "lucide-react-native";
import Animated, { useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DURATION = 400;
const EASING = Easing.inOut(Easing.ease);

export const RecentPhotos = () => {
  const insets = useSafeAreaInsets();

  const { isMenuOpen } = useAttachFileMenu();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMenuOpen.get() ? 1 : 0, { duration: DURATION, easing: EASING }),
      left: withTiming(isMenuOpen.get() ? 16 : 26, { duration: DURATION, easing: EASING }),
      top: withTiming(isMenuOpen.get() ? insets.top + 40 : insets.top + 30, {
        duration: DURATION,
        easing: EASING,
      }),
    };
  });

  return (
    <AnimatedPressable
      style={rContainerStyle}
      className="absolute flex-row items-center gap-1"
      onPress={() => Alert.alert("Recent Photos")}
    >
      <Text className="text-neutral-400 text-xl font-semibold">Recent Photos</Text>
      <ChevronRight size={28} color="gray" />
    </AnimatedPressable>
  );
};
