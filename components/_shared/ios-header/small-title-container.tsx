import React, { FC, PropsWithChildren } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIosHeader } from "./provider";
import { View } from "react-native";
import { BlurBg } from "./blur-bg";

type Props = {
  bgColor: string;
  withBlur: boolean;
  hideSearchBarOnScroll: boolean;
  children: React.ReactNode;
};

export const SmallTitleContainer: FC<PropsWithChildren<Props>> = ({
  children,
  bgColor,
  withBlur,
  hideSearchBarOnScroll,
}) => {
  const insets = useSafeAreaInsets();

  const { listOffsetY, bigTitleAndSearchBarHeight } = useIosHeader();

  const backgroundColor = useAnimatedStyle(() => {
    if (!withBlur || !bigTitleAndSearchBarHeight.value || !hideSearchBarOnScroll) {
      return {
        backgroundColor: bgColor,
      };
    }

    return {
      backgroundColor:
        listOffsetY.value < bigTitleAndSearchBarHeight.value ? bgColor : "transparent",
    };
  });

  return (
    <Animated.View style={[backgroundColor, { paddingTop: insets.top + 8 }]} className="z-[99]">
      <BlurBg withBlur={withBlur} hideSearchBarOnScroll={hideSearchBarOnScroll} />
      <View className="px-5 pb-2 flex-row items-center justify-center">{children}</View>
    </Animated.View>
  );
};
