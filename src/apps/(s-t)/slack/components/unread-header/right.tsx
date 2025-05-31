import React, { FC } from "react";
import { Pressable, Text } from "react-native";
import { useUnreadAnimation } from "../../lib/provider/unread-animation";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useUnreadStore } from "../../lib/store/unread";
import * as Haptics from "expo-haptics";

const EASING = Easing.out(Easing.ease);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Right: FC = () => {
  const total = useUnreadStore.use.total();

  const { currentChannelIndex, undoChannelIndex, isDone } = useUnreadAnimation();

  const rOuterContainerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: undoChannelIndex.get() === null ? "auto" : "none",
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const show = currentChannelIndex.get() < total - 1;

    return {
      pointerEvents: show ? "auto" : "none",
      opacity: withTiming(show ? 1 : 0, { easing: EASING }),
      transform: [{ scale: withTiming(show ? 1 : 0.25, { easing: EASING }) }],
    };
  });

  return (
    <Animated.View style={rOuterContainerStyle}>
      <AnimatedPressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          undoChannelIndex.set(currentChannelIndex.get() + 1);
          if (isDone.get()) {
            isDone.set(false);
          }
        }}
        style={rContainerStyle}
        hitSlop={10}
      >
        <Text className="text-base font-bold text-neutral-200">Undo</Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
