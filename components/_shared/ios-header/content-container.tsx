import React, { FC, PropsWithChildren } from "react";
import Animated, { useAnimatedStyle, Extrapolation, interpolate } from "react-native-reanimated";
import { useIosHeader } from "./provider";
import { _bigTitlePaddingTop } from "./big-title-and-searchbar-container";

type Props = {
  hideSearchBarOnScroll?: boolean;
  bgColor?: string;
};

export const ContentContainer: FC<PropsWithChildren<Props>> = ({
  children,
  hideSearchBarOnScroll,
  bgColor,
}) => {
  const { listOffsetY, headerContentHeight, bigTitleHeight, searchbarHeight } = useIosHeader();

  const rTransformYStyle = useAnimatedStyle(() => {
    if (!headerContentHeight.value || !headerContentHeight.value) {
      return {};
    }

    if (hideSearchBarOnScroll) {
      return {
        transform: [
          {
            translateY: interpolate(
              listOffsetY.value,
              [-1000, 0, searchbarHeight.value, headerContentHeight.value],
              [1000, 0, 0, -headerContentHeight.value + searchbarHeight.value],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    }

    const totalBigTitleHeight = bigTitleHeight.value + _bigTitlePaddingTop;

    return {
      transform: [
        {
          translateY: interpolate(
            listOffsetY.value,
            [-1000, 0, totalBigTitleHeight],
            [1000, 0, -totalBigTitleHeight],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[rTransformYStyle, { backgroundColor: bgColor }]}
      className="px-5"
      onLayout={({ nativeEvent }) => {
        headerContentHeight.value = nativeEvent.layout.height;
      }}
    >
      {children}
    </Animated.View>
  );
};
