import React, { FC, use } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { AnimatedIndexContext } from "../../../routes/onboarding";
import Animated, { useAnimatedStyle, interpolate, withSpring } from "react-native-reanimated";
import { RedCard } from "./red-card";

export const Welcome: FC = () => {
  const { width } = useWindowDimensions();

  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateX = withSpring(interpolate(activeIndex.get(), [0, 1], [0, -20]), {
      stiffness: 600,
      damping: 5,
    });
    return { transform: [{ translateX }] };
  });

  return (
    <View className="flex-1">
      <RedCard />
    </View>
  );
};
