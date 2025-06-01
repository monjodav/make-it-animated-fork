import React, { FC } from "react";
import { Pressable, Text } from "react-native";
import { useCatchUpAnimation } from "../../lib/provider/catch-up-animation";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useCatchUpStore } from "../../lib/store/catch-up";
import * as Haptics from "expo-haptics";

// slack-catch-up-cards-swipe-animation 🔽

const EASING = Easing.out(Easing.ease);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Right: FC = () => {
  const total = useCatchUpStore.use.total();

  const { currentChannelIndex, undoChannelIndex, isDone } = useCatchUpAnimation();

  const rOuterContainerStyle = useAnimatedStyle(() => {
    // I want to disable it for short moment to let animation complete
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

// slack-catch-up-cards-swipe-animation 🔼
