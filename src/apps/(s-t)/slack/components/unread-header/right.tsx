import React, { FC } from "react";
import { Pressable, Text } from "react-native";
import { useUnreadAnimation } from "../../lib/provider/unread-animation";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useUnreadStore } from "../../lib/store/unread";

const EASING = Easing.out(Easing.ease);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Right: FC = () => {
  const unreadChannels = useUnreadStore.use.unreadChannels();

  const { currentChannelIndex, undoChannelIndex, isDone } = useUnreadAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    const show = currentChannelIndex.get() < unreadChannels.length - 1;

    return {
      pointerEvents: show ? "auto" : "none",
      opacity: withTiming(show ? 1 : 0, { easing: EASING }),
      transform: [{ scale: withTiming(show ? 1 : 0.25, { easing: EASING }) }],
    };
  });

  return (
    <AnimatedPressable
      onPress={() => {
        undoChannelIndex.set(currentChannelIndex.get() + 1);
        if (isDone.get()) {
          isDone.set(false);
        }
      }}
      style={rContainerStyle}
    >
      <Text className="text-base font-bold text-neutral-200">Undo</Text>
    </AnimatedPressable>
  );
};
