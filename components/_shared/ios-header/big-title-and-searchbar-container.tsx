import React, { FC, PropsWithChildren } from "react";
import { useIosHeader } from "./provider";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export const _bigTitlePaddingTop = 12;

type Props = {
  hideSearchBarOnScroll: boolean;
};

export const BigTitleAndSearchbarContainer: FC<PropsWithChildren<Props>> = ({
  children,
  hideSearchBarOnScroll,
}) => {
  const { listOffsetY, bigTitleAndSearchBarHeight } = useIosHeader();

  const rStyle = useAnimatedStyle(() => {
    if (!bigTitleAndSearchBarHeight.value || !hideSearchBarOnScroll) {
      return { opacity: 1 };
    }

    return {
      opacity: listOffsetY.value > bigTitleAndSearchBarHeight.value ? 0 : 1,
    };
  });

  return (
    <Animated.View
      className="px-1 gap-3"
      style={[rStyle, { paddingTop: _bigTitlePaddingTop }]}
      onLayout={(e) => (bigTitleAndSearchBarHeight.value = e.nativeEvent.layout.height)}
    >
      {children}
    </Animated.View>
  );
};
