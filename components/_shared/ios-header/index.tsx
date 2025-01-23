import React, { FC } from "react";
import { View, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "./search-bar";
import { useIosHeader } from "./provider";

const _bigTitlePaddingTop = 12;

type Props = {
  smallTitle?: string;
  bigTitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  hideSearchBarOnScroll?: boolean;
};

export const IosHeader: FC<Props> = ({
  smallTitle,
  bigTitle,
  left,
  right,
  bottom,
  hideSearchBarOnScroll = true,
}) => {
  const insets = useSafeAreaInsets();
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

    return {
      height: interpolate(
        listOffsetY.value,
        [0, headerContentHeight.value],
        [headerHeight.value, headerHeight.value - headerContentHeight.value],
        Extrapolation.CLAMP
      ),
    };
  });

  const rTransformYStyle = useAnimatedStyle(() => {
    if (!headerContentHeight.value) {
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

    return {
      transform: [
        {
          translateY: interpolate(
            listOffsetY.value,
            [-1000, 0, headerContentHeight.value],
            [1000, 0, -headerContentHeight.value],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

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
    <Animated.View
      style={rHeaderStyle}
      className="z-[999] absolute left-0 right-0"
      onLayout={({ nativeEvent }) => (headerHeight.value = nativeEvent.layout.height)}
    >
      <View className="bg-black z-[99]" style={{ height: insets.top + 8 }} />
      <View className="px-5 pb-2 flex-row items-center justify-center bg-black z-[99]">
        <View className="absolute left-0">{left}</View>
        {smallTitle && (
          <Animated.Text
            style={rSmallTitleStyle}
            className="text-lg text-neutral-300 font-semibold"
          >
            {smallTitle}
          </Animated.Text>
        )}
        <View className="absolute right-0">{right}</View>
      </View>
      <Animated.View
        style={rTransformYStyle}
        className="px-5"
        onLayout={({ nativeEvent }) => {
          headerContentHeight.value = nativeEvent.layout.height;
        }}
      >
        <View className="px-1 gap-3" style={{ paddingTop: _bigTitlePaddingTop }}>
          <Text
            className="text-neutral-300 font-bold text-3xl"
            onLayout={({ nativeEvent }) => (bigTitleHeight.value = nativeEvent.layout.height)}
          >
            {bigTitle}
          </Text>
          <SearchBar hideSearchBarOnScroll={hideSearchBarOnScroll} />
        </View>
        {bottom}
      </Animated.View>
    </Animated.View>
  );
};
