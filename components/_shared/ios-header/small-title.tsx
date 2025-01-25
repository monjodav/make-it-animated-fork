import React, { FC } from "react";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useIosHeader } from "./provider";
import { _bigTitlePaddingTop } from "./big-title-and-searchbar-container";

type Props = {
  smallTitle?: string;
  hideSearchBarOnScroll?: boolean;
};

export const SmallTitle: FC<Props> = ({ smallTitle, hideSearchBarOnScroll }) => {
  const { listOffsetY, bigTitleHeight, searchbarHeight } = useIosHeader();

  const rSmallTitleStyle = useAnimatedStyle(() => {
    if (!bigTitleHeight.value || !searchbarHeight.value) {
      return {
        opacity: 0,
      };
    }

    const fontCorrection = 6;
    // Correction above can vary depending on the font so it hard to measure
    // I need to to show small title exactly on big title bottom line disappearing

    if (hideSearchBarOnScroll) {
      const bigTitleY = bigTitleHeight.value + _bigTitlePaddingTop - fontCorrection;

      return {
        opacity: withTiming(listOffsetY.value > bigTitleY + searchbarHeight.value ? 1 : 0),
      };
    }

    return {
      opacity: withTiming(
        listOffsetY.value > bigTitleHeight.value + _bigTitlePaddingTop - fontCorrection ? 1 : 0
      ),
    };
  });

  return (
    <Animated.Text style={rSmallTitleStyle} className="text-lg text-neutral-300 font-semibold">
      {smallTitle ?? ""}
    </Animated.Text>
  );
};
