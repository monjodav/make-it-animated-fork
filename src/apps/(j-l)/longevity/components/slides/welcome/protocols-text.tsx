import React, { FC, use } from "react";
import { useWindowDimensions } from "react-native";
import { SlideTextContainer } from "../../slide-text-container";
import { AnimatedIndexContext } from "../../../routes/onboarding";
import { Extrapolation, interpolate, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { BASE_SPRING_CONFIG } from "../../../lib/constants";

export const ProtocolsText: FC = () => {
  const { width: screenWidth } = useWindowDimensions();

  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.get(),
      [0, 1],
      [0, -screenWidth],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: withSpring(translateX, BASE_SPRING_CONFIG) }],
    };
  });

  return (
    <SlideTextContainer style={rContainerStyle} className="absolute top-[75%] left-[33%]">
      88 Protocols inside
    </SlideTextContainer>
  );
};
