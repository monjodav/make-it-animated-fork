import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, Pressable, View, PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ShimmerComponent } from "./shimmer-components";

// discord-button-shimmer-effect-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Consistent timing for press animations
const DURATION = 200;

type Props = Omit<PressableProps, "onPressIn" | "onPressOut"> & {
  withShimmer?: boolean;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

export const CustomButton: FC<PropsWithChildren<Props>> = ({
  children,
  withShimmer,
  onPressIn,
  onPressOut,
  ...props
}) => {
  // Track button width for shimmer animation calculations - passed to shimmer component
  const containerWidth = useSharedValue(0);
  // Controls button scale during press - creates tactile feedback
  const scale = useSharedValue(1);

  // Apply scale transform for press feedback - smooth transition between normal/pressed states
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.get() }], // Direct scale transformation for immediate response
    };
  });

  return (
    <AnimatedPressable
      className="flex-1 bg-[#393A43] rounded-full"
      style={[styles.container, rContainerStyle]}
      onLayout={(e) => containerWidth.set(e.nativeEvent.layout.width)} // Capture width for shimmer bounds
      onPressIn={() => {
        scale.set(withTiming(0.95, { duration: DURATION })); // 5% scale reduction - subtle but noticeable press feedback
        onPressIn?.();
      }}
      onPressOut={() => {
        scale.set(withTiming(1, { duration: DURATION })); // Return to normal scale with same timing for consistency
        onPressOut?.();
      }}
      {...props}
    >
      <View className="flex-row items-center justify-center gap-1 py-3.5 px-6 rounded-full overflow-hidden border-[0.5px] border-[#C7C8CE]/10">
        {/* overflow-hidden clips shimmer animation to button bounds */}
        {withShimmer && <ShimmerComponent containerWidth={containerWidth} />}
        {/* Pass width for responsive shimmer scaling */}
        {children}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous", // iOS 16+ continuous curves for modern appearance
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

// discord-button-shimmer-effect-animation 🔼
