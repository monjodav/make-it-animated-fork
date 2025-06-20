import { CircleGauge } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GetNitroBtn: FC = () => {
  const containerWidth = useSharedValue(0);
  const shimmerElementWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (shimmerElementWidth.value === 0) {
      return {
        opacity: 0,
      };
    }

    // Base duration in milliseconds for the animation
    const baseDuration = 1100;
    const referenceWidth = 200;
    // Calculate duration based on container width (wider = longer duration)
    const duration = baseDuration * (containerWidth.value / referenceWidth);

    return {
      opacity: 1,
      transform: [
        {
          translateX: withRepeat(
            withSequence(
              withDelay(2000, withTiming(-shimmerElementWidth.value * 1.2, { duration: 0 })),
              withTiming(containerWidth.value * 1.2, {
                duration: Math.max(duration, baseDuration),
                easing: Easing.in(Easing.ease),
              })
            ),
            -1, // Infinite repetition
            false // Reverse the animation
          ),
        },
        { rotate: "30deg" },
      ],
    };
  });

  return (
    <AnimatedPressable
      className=" bg-[#393A43] rounded-full"
      style={styles.container}
      onLayout={(e) => containerWidth.set(e.nativeEvent.layout.width)}
    >
      <View className="flex-row items-center justify-center gap-1 py-3.5 px-6 rounded-full overflow-hidden border-[0.5px] border-[#C7C8CE]/10">
        <Animated.View
          className="absolute left-0 -top-[200%] -bottom-[200%] flex-row"
          style={[animatedStyle]}
          onLayout={(e) => shimmerElementWidth.set(e.nativeEvent.layout.width)}
        >
          <View className="w-6 bg-[#C7C8CE]/5" />
          <View className="w-5 bg-[#C7C8CE]/15" />
          <View className="w-6 bg-[#C7C8CE]/5" />
        </Animated.View>
        <CircleGauge size={16} color="#C7C8CE" />
        <Text className="font-semibold text-[#C7C8CE]">Get Nitro</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
