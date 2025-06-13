import React, { FC } from "react";
import { StyleSheet, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import qrCodeAnimation from "@/assets/lottie/qr-code.json";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIndexAnimation } from "@/src/shared/lib/providers/index-animation";
import * as Haptics from "expo-haptics";

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
        <LottieView source={qrCodeAnimation} autoPlay loop={false} style={styles.lottie} />
        <Animated.Text entering={FadeIn.delay(3000)} className="text-stone-200 font-medium text-sm">
          Press to scan
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 90,
    height: 90,
  },
});
