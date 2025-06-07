import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { Logo } from "./logo";
import { Heart, Send } from "lucide-react-native";
import { useHomeHeaderHeight } from "../lib/hooks/use-home-header-height";
import { useAnimatedScroll } from "../lib/providers/animated-scroll";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const HEADER_HEIGHT = 50;
const DURATION = 150;

export const CustomHeader: FC = () => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const {
    offsetY,
    velocityYonEndDrag,
    headerTop,
    isHeaderVisible,
    scrollDirection,
    offsetYAnchorOnBeginDrag,
    offsetYAnchorOnChangeDirection,
  } = useAnimatedScroll();

  const headerTopAnchor = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const headerOpacityAnchor = useSharedValue(1);

  const skipTopInterpolation = useSharedValue(false);

  const isTopOfList = useDerivedValue(() => offsetY.value < netHeaderHeight * 3);
  const isVelocityHigh = useDerivedValue(() => Math.abs(velocityYonEndDrag.value) > 1.3);

  useAnimatedReaction(
    () => offsetYAnchorOnChangeDirection.value,
    () => {
      headerTopAnchor.set(headerTop.get());
      headerOpacityAnchor.set(headerOpacity.get());
    }
  );

  const rPositionContainer = useAnimatedStyle(() => {
    if (offsetY.get() <= 0 && skipTopInterpolation.get()) {
      skipTopInterpolation.set(false);
    }

    if (isTopOfList.get() && !skipTopInterpolation.get()) {
      headerTop.set(
        interpolate(offsetY.value, [0, netHeaderHeight], [0, -netHeaderHeight], Extrapolation.CLAMP)
      );
    }

    if (!isTopOfList.get()) {
      if (!isHeaderVisible.get() && isVelocityHigh.get() && scrollDirection.get() === "to-top") {
        headerTop.set(withTiming(0, { duration: DURATION }));
        skipTopInterpolation.set(true);
      }

      if (isHeaderVisible.get() && !isVelocityHigh.get()) {
        headerTop.set(
          interpolate(
            offsetY.value,
            [offsetYAnchorOnBeginDrag.get(), offsetYAnchorOnBeginDrag.get() + netHeaderHeight],
            [0, -netHeaderHeight],
            Extrapolation.CLAMP
          )
        );
      }
    }

    return {
      top: headerTop.value,
    };
  });

  const rOpacityContainer = useAnimatedStyle(() => {
    if (isTopOfList.get() && !skipTopInterpolation.get()) {
      headerOpacity.set(
        interpolate(offsetY.value, [0, netHeaderHeight * 0.75], [1, 0], Extrapolation.CLAMP)
      );
    }

    if (!isTopOfList.get()) {
      if (!isHeaderVisible.get() && isVelocityHigh.get() && scrollDirection.get() === "to-top") {
        headerOpacity.set(withTiming(1, { duration: DURATION }));
      }

      if (isHeaderVisible.get() && !isVelocityHigh.get()) {
        headerOpacity.set(
          interpolate(
            offsetY.value,
            [offsetYAnchorOnBeginDrag.get(), offsetYAnchorOnBeginDrag.get() + netHeaderHeight],
            [1, 0],
            Extrapolation.CLAMP
          )
        );
      }
    }

    return {
      opacity: headerOpacity.value,
    };
  });

  return (
    <Animated.View className="absolute left-0 right-0  bg-black z-50" style={rPositionContainer}>
      <Animated.View
        className="flex-row items-center justify-between px-5"
        style={[{ height: netHeaderHeight }, rOpacityContainer]}
      >
        <Logo width={110} height={30} />
        <View className="flex-row items-center gap-8">
          <Pressable>
            <Heart size={22} color="white" />
          </Pressable>
          <Pressable>
            <Send size={22} color="white" />
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};
