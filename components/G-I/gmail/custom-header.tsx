import { Menu } from "lucide-react-native";
import React, { FC } from "react";
import { View, TextInput } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useHeaderHeight } from "./lib/hooks/use-header-height";
import { useAnimatedList } from "./lib/animated-list-provider";

// gmail-header-scroll-animation 🔽

const _thresholdBase = 150;

export const CustomHeader: FC = () => {
  const { safeAreaHeight, searchBarHeight } = useHeaderHeight();

  const { listRef, listOffsetY, scrollDirection, isDragging } = useAnimatedList();

  const listOffsetYAnchor = useSharedValue(0);
  const opacity = useSharedValue(1);
  const opacityAnchor = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateYAnchor = useSharedValue(0);
  const threshold = useSharedValue(0);

  useAnimatedReaction(
    () => scrollDirection.value,
    (current, previous) => {
      listOffsetYAnchor.value = listOffsetY.value;
      opacityAnchor.value = opacity.value;
      translateYAnchor.value = translateY.value;
      if (isDragging.value && previous === "to-top" && current === "to-bottom") {
        threshold.value = 0;
      }
    }
  );

  useAnimatedReaction(
    () => listOffsetY.value,
    (currentOffset) => {
      if (
        currentOffset > _thresholdBase &&
        threshold.value !== _thresholdBase &&
        !isDragging.value
      ) {
        threshold.value = _thresholdBase;
      } else if (currentOffset <= _thresholdBase && threshold.value !== 0 && !isDragging.value) {
        threshold.value = 0;
      }
    }
  );

  const scrollTo = (offset: number) => {
    listRef.current?.scrollToOffset({ offset, animated: true });
  };

  useAnimatedReaction(
    () => isDragging.value,
    (current, previous) => {
      if (!current && previous) {
        const isSearchbarVisible = opacity.value > 0 && opacity.value < 1;

        if (scrollDirection.value === "to-top" && isSearchbarVisible) {
          runOnJS(scrollTo)(listOffsetY.value - searchBarHeight);
        }
        if (scrollDirection.value === "to-bottom" && isSearchbarVisible) {
          runOnJS(scrollTo)(listOffsetY.value + searchBarHeight);
        }
      }
    }
  );

  const rSearchBarStyle = useAnimatedStyle(() => {
    if (scrollDirection.value === "to-bottom") {
      const inputRange = [listOffsetYAnchor.value, listOffsetYAnchor.value + searchBarHeight];

      opacity.value = interpolate(
        listOffsetY.value,
        inputRange,
        [opacityAnchor.value, 0],
        Extrapolation.CLAMP
      );
      translateY.value = interpolate(
        listOffsetY.value,
        inputRange,
        [translateYAnchor.value, -searchBarHeight],
        Extrapolation.CLAMP
      );
    }

    if (scrollDirection.value === "to-top") {
      const inputRange = [
        listOffsetYAnchor.value - threshold.value - searchBarHeight,
        listOffsetYAnchor.value - threshold.value,
        listOffsetYAnchor.value,
      ];

      opacity.value = interpolate(
        listOffsetY.value,
        inputRange,
        [1, opacityAnchor.value, opacityAnchor.value],
        Extrapolation.CLAMP
      );

      translateY.value = interpolate(
        listOffsetY.value,
        inputRange,
        [0, translateYAnchor.value, translateYAnchor.value],
        Extrapolation.CLAMP
      );
    }

    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View className="absolute top-0 left-0 right-0">
      <View style={{ height: safeAreaHeight }} className="bg-neutral-900/75" />
      <Animated.View className="px-5 flex-row items-center" style={rSearchBarStyle}>
        <TextInput
          className="flex-1 bg-neutral-800 rounded-xl font-medium px-14 text-neutral-200"
          style={{ height: searchBarHeight }}
          placeholder="Search in mail"
          placeholderTextColor="darkgray"
        />
        <View className="absolute left-8">
          <Menu size={24} color="lightgray" />
        </View>
        <View className="absolute right-8 w-8 h-8 rounded-full bg-yellow-300/25" />
      </Animated.View>
    </View>
  );
};

// gmail-header-scroll-animation 🔼
