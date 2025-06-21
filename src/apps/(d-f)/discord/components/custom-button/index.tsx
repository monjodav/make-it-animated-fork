import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, Pressable, View, PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ShimmerComponent } from "./shimmer-components";

// discord-button-shimmer-effect-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const containerWidth = useSharedValue(0);
  const scale = useSharedValue(1);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.get() }],
    };
  });

  return (
    <AnimatedPressable
      className="flex-1 bg-[#393A43] rounded-full"
      style={[styles.container, rContainerStyle]}
      onLayout={(e) => containerWidth.set(e.nativeEvent.layout.width)}
      onPressIn={() => {
        scale.set(withTiming(0.95, { duration: DURATION }));
        onPressIn?.();
      }}
      onPressOut={() => {
        scale.set(withTiming(1, { duration: DURATION }));
        onPressOut?.();
      }}
      {...props}
    >
      <View className="flex-row items-center justify-center gap-1 py-3.5 px-6 rounded-full overflow-hidden border-[0.5px] border-[#C7C8CE]/10">
        {withShimmer && <ShimmerComponent containerWidth={containerWidth} />}
        {children}
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

// discord-button-shimmer-effect-animation 🔼
