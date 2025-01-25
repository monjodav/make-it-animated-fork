import React, { FC, PropsWithChildren } from "react";
import { useIosHeader } from "./provider";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { _bigTitlePaddingTop } from "./big-title-and-searchbar-container";

type Props = {
  hideSearchBarOnScroll?: boolean;
};

export const HeaderContainer: FC<PropsWithChildren<Props>> = ({
  children,
  hideSearchBarOnScroll,
}) => {
  const { listOffsetY, headerHeight, headerContentHeight, bigTitleHeight, searchbarHeight } =
    useIosHeader();

  const rHeaderStyle = useAnimatedStyle(() => {
    if (
      !headerHeight.value ||
      !headerContentHeight.value ||
      !bigTitleHeight.value ||
      !searchbarHeight.value
    ) {
      return {};
    }

    if (hideSearchBarOnScroll) {
      return {
        height: interpolate(
          listOffsetY.value,
          [0, searchbarHeight.value, headerContentHeight.value],
          [
            headerHeight.value,
            headerHeight.value - searchbarHeight.value,
            headerHeight.value - headerContentHeight.value,
          ],
          Extrapolation.CLAMP
        ),
      };
    }

    const totalBigTitleHeight = bigTitleHeight.value + _bigTitlePaddingTop;

    return {
      height: interpolate(
        listOffsetY.value,
        [0, totalBigTitleHeight],
        [headerHeight.value, headerHeight.value - totalBigTitleHeight],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      style={rHeaderStyle}
      className="z-[999] absolute left-0 right-0"
      onLayout={({ nativeEvent }) => (headerHeight.value = nativeEvent.layout.height)}
    >
      {children}
    </Animated.View>
  );
};
