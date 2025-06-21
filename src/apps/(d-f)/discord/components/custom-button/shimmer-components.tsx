import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
  SharedValue,
} from "react-native-reanimated";

// discord-button-shimmer-effect-animation 🔽

type Props = {
  containerWidth: SharedValue<number>;
};

export const ShimmerComponent: FC<Props> = ({ containerWidth }) => {
  const shimmerComponentWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    if (shimmerComponentWidth.value === 0) {
      return {
        opacity: 0,
      };
    }

    // Base duration in milliseconds for the animation
    const baseDuration = 1100;
    // Reference width for the animation
    const referenceWidth = 200;
    // Calculate duration based on container width (wider = longer duration)
    const duration = baseDuration * (containerWidth.value / referenceWidth);

    return {
      opacity: 1,
      transform: [
        {
          translateX: withRepeat(
            withSequence(
              withDelay(2000, withTiming(-shimmerComponentWidth.value * 1.2, { duration: 0 })),
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
    <Animated.View
      className="absolute left-0 -top-[200%] -bottom-[200%] flex-row"
      style={[animatedStyle]}
      onLayout={(e) => shimmerComponentWidth.set(e.nativeEvent.layout.width)}
    >
      <View className="w-6 bg-[#C7C8CE]/5" />
      <View className="w-5 bg-[#C7C8CE]/15" />
      <View className="w-6 bg-[#C7C8CE]/5" />
    </Animated.View>
  );
};

// discord-button-shimmer-effect-animation 🔼
