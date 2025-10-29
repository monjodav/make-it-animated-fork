import React, { FC, use } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { AnimatedIndexContext } from "../../../routes/onboarding";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  mass: 1,
  stiffness: 240,
  damping: 20,
};

export const RedCard: FC = () => {
  const { width: screenWidth } = useWindowDimensions();

  const _cardWidth = screenWidth * 0.5;
  const _cardHeight = _cardWidth * 1.2;
  const _cardStartX = screenWidth / 2 - _cardWidth / 2;

  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.get(),
      [0, 1, 2],
      [_cardStartX, _cardStartX + screenWidth, _cardStartX + screenWidth * 2],
      Extrapolation.CLAMP
    );
    const rotate = interpolate(activeIndex.get(), [0, 1, 2], [-2, -4, 3], Extrapolation.CLAMP);
    const scale = interpolate(activeIndex.get(), [0, 1, 2], [1, 0.98, 1.2], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX: withSpring(translateX, SPRING_CONFIG) },
        { rotate: withSpring(`${rotate}deg`, SPRING_CONFIG) },
        { scale: withSpring(scale, SPRING_CONFIG) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        rContainerStyle,
        { width: _cardWidth, height: _cardHeight, transformOrigin: "center" },
      ]}
      className="bg-red-500 rounded-2xl items-center justify-center gap-10"
    >
      <View className="size-20 rounded-2xl bg-amber-500" />
      <Text className="text-xl text-white font-medium">Dry Sauna</Text>
    </Animated.View>
  );
};
