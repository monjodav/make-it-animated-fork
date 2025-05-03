import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FULL_DRAG_DISTANCE,
  TRIGGER_DRAG_DISTANCE,
  useHomeAnimation,
} from "../../lib/providers/home-animation";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";

type FavoriteItemProps = {
  iconClassName?: string;
  labelClassName?: string;
};

const FavoriteItem: FC<FavoriteItemProps> = ({ iconClassName, labelClassName }) => {
  return (
    <View className="flex-1 gap-3 items-center justify-center">
      <View className={cn("w-14 h-14 rounded-2xl", iconClassName)} style={styles.borderCurve} />
      <View className={cn("h-2 w-5 rounded-full bg-neutral-200/10", labelClassName)} />
    </View>
  );
};

export const Favorites = () => {
  const insets = useSafeAreaInsets();
  const { grossHeight } = useHeaderHeight();

  const { screenView, offsetY, blurIntensity, onGoToCommands } = useHomeAnimation();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetYValue = event.contentOffset.y;

      offsetY.value = offsetYValue;

      if (screenView === "favorites") {
        blurIntensity.value = interpolate(
          offsetYValue,
          [0, FULL_DRAG_DISTANCE],
          [0, 100],
          Extrapolation.CLAMP
        );
      }
    },
    onEndDrag: (event) => {
      const scrollY = event.contentOffset.y;
      if (scrollY < TRIGGER_DRAG_DISTANCE) {
        runOnJS(onGoToCommands)();
      }
    },
  });

  return (
    <Animated.ScrollView
      className="px-5"
      style={{
        paddingBottom: insets.bottom + 8,
        paddingTop: grossHeight + 40,
        pointerEvents: screenView === "commands" ? "none" : "auto",
      }}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
    >
      <View className="flex-row mb-10">
        <FavoriteItem iconClassName="bg-rose-950" />
        <FavoriteItem iconClassName="bg-orange-900" labelClassName="w-10" />
        <FavoriteItem iconClassName="bg-indigo-900" labelClassName="w-16" />
        <FavoriteItem iconClassName="bg-sky-800" labelClassName="w-14" />
      </View>
      <View className="h-3 w-20 rounded-full bg-neutral-200/10 mb-10" />
      <View className="h-8 w-full rounded-xl bg-neutral-700/5 mb-1" />
      <View className="h-8 w-full rounded-xl bg-neutral-700/5 mb-10" />
      <View className="items-center">
        <View className="h-3 w-3/4 rounded-full bg-neutral-200/10 mb-2" />
        <View className="h-3 w-1/2 rounded-full bg-neutral-200/10 mb-4" />
        <View className="h-8 w-32 rounded-xl bg-neutral-200/10 mb-2" />
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
