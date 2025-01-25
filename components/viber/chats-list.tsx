import React, { FC } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { ChatListItem } from "./chat-list-item";
import { useIosHeader } from "../_shared/ios-header/provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Insets } from "react-native";

export const ChatsList: FC = () => {
  const insets = useSafeAreaInsets();

  const { listOffsetY, headerHeight } = useIosHeader();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      listOffsetY.value = y;
    },
  });

  const rListStyle = useAnimatedStyle(() => {
    return {
      paddingTop: headerHeight.value,
    };
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
      renderItem={({ item }) => <ChatListItem key={item} />}
      style={rListStyle}
      contentContainerClassName="p-5 gap-4"
      indicatorStyle="white"
      scrollIndicatorInsets={scrollIndicatorInsets}
      scrollEventThrottle={1000 / 60}
      onScroll={scrollHandler}
    />
  );
};
