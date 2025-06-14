import React, { FC } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIndexAnimation } from "@/src/shared/lib/providers/index-animation";
import * as Haptics from "expo-haptics";
import { QrCodeIcon } from "lucide-react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PressToScanBtn: FC = () => {
  const { state } = useIndexAnimation();

  const scale = useSharedValue(1);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(state.value, [0, 1], [1, 0]),
      transform: [{ scale: interpolate(state.value, [0, 1], [1, 2]) }],
    };
  });

  const rPressableStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={rContainerStyle}>
      <AnimatedPressable
        onPressIn={() => scale.set(withTiming(0.95, { duration: 100 }))}
        onPressOut={() => scale.set(withTiming(1, { duration: 100 }))}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          state.set(withTiming(1, { duration: 200 }));
        }}
        className="gap-1.5 items-center"
        style={rPressableStyle}
      >
        <Animated.View entering={FadeIn.delay(1000)}>
          <QrCodeIcon size={60} color="#e7e5e4" />
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.delay(1200)}
          className="text-stone-200 font-medium text-sm"
        >
          Press to scan
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
