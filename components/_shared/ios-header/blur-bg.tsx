import { BlurView } from "expo-blur";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useIosHeader } from "./provider";

type Props = {
  withBlur: boolean;
  hideSearchBarOnScroll: boolean;
};

export const BlurBg: FC<Props> = ({ withBlur, hideSearchBarOnScroll }) => {
  const { listOffsetY, bigTitleAndSearchBarHeight } = useIosHeader();

  const rStyle = useAnimatedStyle(() => {
    if (!withBlur || !bigTitleAndSearchBarHeight.value || !hideSearchBarOnScroll) {
      return { opacity: 0 };
    }

    return {
      opacity: withTiming(listOffsetY.value > bigTitleAndSearchBarHeight.value ? 1 : 0, {
        duration: 150,
      }),
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, rStyle]}>
      <BlurView
        tint="systemChromeMaterialDark"
        intensity={100}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};
