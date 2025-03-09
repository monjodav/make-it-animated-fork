import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from "react-native-reanimated";
import { CallsListItem } from "./calls-list-item";

type Props = {
  offsetY: SharedValue<number>;
  largeTitleHeight: SharedValue<number>;
};

export const CallsList: FC<Props> = ({ offsetY, largeTitleHeight }) => {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  const rListContainerStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        offsetY.value,
        [0, largeTitleHeight.value],
        [0, largeTitleHeight.value],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.FlatList
      data={Array.from({ length: 20 }, (_, index) => index)}
      renderItem={({ item }) => <CallsListItem key={item} />}
      ListHeaderComponent={() => <View className="h-[75px] bg-neutral-900 rounded-2xl" />}
      style={rListContainerStyle}
      contentContainerClassName="gap-4 p-5 pt-3"
      indicatorStyle="white"
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    />
  );
};
