import React, { FC, use } from "react";
import { useWindowDimensions } from "react-native";
import { SlideTextContainer } from "../../slide-text-container";
import { AnimatedIndexContext } from "../../../routes/onboarding";
import { Extrapolation, interpolate, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { BASE_SPRING_CONFIG } from "../../../lib/constants";

export const UpdatedTodayText: FC = () => {
  const { width: screenWidth } = useWindowDimensions();

  const { activeIndex } = use(AnimatedIndexContext);

  const rContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.get(),
      [1, 2, 3],
      [screenWidth * 0.25, 0, -screenWidth],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: withSpring(translateX, BASE_SPRING_CONFIG) }],
    };
  });

  return (
    <SlideTextContainer style={rContainerStyle} className="absolute -top-[5%] left-[10%]">
      ⏰ Updated today
    </SlideTextContainer>
  );
};
