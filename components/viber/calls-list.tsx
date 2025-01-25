import React, { FC } from "react";
import { Insets, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useDerivedValue,
} from "react-native-reanimated";
import { CallsListItem } from "./calls-list-item";
import { useIosHeader } from "../_shared/ios-header/provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CallsList: FC = () => {
  const insets = useSafeAreaInsets();

  const { listOffsetY, headerHeight, listPaddingTop } = useIosHeader();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      listOffsetY.value = y;
    },
  });

  const scrollIndicatorInsets = useDerivedValue<Insets>(() => {
    if (!headerHeight.value) {
      return { top: 0 };
    }

    return {
      top: interpolate(
        listOffsetY.value,
        [0, headerHeight.value - insets.top],
        [headerHeight.value - insets.top, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.FlatList
      data={Array.from({ length: 20 }, (_, index) => index)}
      renderItem={({ item }) => <CallsListItem key={item} />}
      ListHeaderComponent={() => <View className="h-[75px] bg-neutral-900 rounded-2xl" />}
      contentContainerClassName="gap-4 p-5"
      style={{
        paddingTop: listPaddingTop,
      }}
      indicatorStyle="white"
      scrollIndicatorInsets={scrollIndicatorInsets}
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    />
  );
};
