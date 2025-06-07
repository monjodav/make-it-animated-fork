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
  useSharedValue,
} from "react-native-reanimated";

export const HEADER_HEIGHT = 50;

export const CustomHeader: FC = () => {
  const { netHeaderHeight } = useHomeHeaderHeight();

  const { offsetY, headerTop, scrollDirection, offsetYAnchorOnChangeDirection } =
    useAnimatedScroll();

  const headerTopAnchor = useSharedValue(0);
  const headerOpacity = useSharedValue(1);
  const headerOpacityAnchor = useSharedValue(1);

  useAnimatedReaction(
    () => offsetYAnchorOnChangeDirection.value,
    (offsetValue) => {
      headerTopAnchor.set(headerTop.get());
      headerOpacityAnchor.set(headerOpacity.get());
    }
  );

  const rPositionContainer = useAnimatedStyle(() => {
    if (scrollDirection.value === "to-bottom") {
      headerTop.set(
        interpolate(
          offsetY.value,
          [
            offsetYAnchorOnChangeDirection.get(),
            offsetYAnchorOnChangeDirection.get() + netHeaderHeight,
          ],
          [headerTopAnchor.get(), -netHeaderHeight],
          Extrapolation.CLAMP
        )
      );
    }

    if (scrollDirection.value === "to-top") {
      headerTop.set(
        interpolate(
          offsetY.value,
          [
            offsetYAnchorOnChangeDirection.get(),
            offsetYAnchorOnChangeDirection.get() - netHeaderHeight,
          ],
          [headerTopAnchor.get(), 0],
          Extrapolation.CLAMP
        )
      );
    }

    return {
      top: headerTop.value,
    };
  });

  const rOpacityContainer = useAnimatedStyle(() => {
    if (scrollDirection.value === "to-bottom") {
      headerOpacity.set(
        interpolate(
          offsetY.value,
          [
            offsetYAnchorOnChangeDirection.get(),
            offsetYAnchorOnChangeDirection.get() + netHeaderHeight,
          ],
          [headerOpacityAnchor.get(), 0],
          Extrapolation.CLAMP
        )
      );
    }

    if (scrollDirection.value === "to-top") {
      headerOpacity.set(
        interpolate(
          offsetY.value,
          [
            offsetYAnchorOnChangeDirection.get(),
            offsetYAnchorOnChangeDirection.get() - netHeaderHeight,
          ],
          [headerOpacityAnchor.get(), 1],
          Extrapolation.CLAMP
        )
      );
    }

    return {
      opacity: headerOpacity.value,
    };
  });

  return (
    <Animated.View
      className="absolute left-0 right-0  bg-black z-50"
      style={[{ height: netHeaderHeight }, rPositionContainer]}
    >
      <Animated.View
        className="flex-row items-center justify-between px-5"
        style={rOpacityContainer}
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
