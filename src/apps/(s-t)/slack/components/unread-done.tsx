import React, { FC } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import { useUnreadStore } from "../lib/store/unread";

const EASING = Easing.out(Easing.ease);

type Props = {
  total: number;
};

export const UnreadDone: FC<Props> = ({ total }) => {
  const { isDone } = useChannelAnimation();
  const resetStore = useUnreadStore.use.reset();

  const rContainerStyle = useAnimatedStyle(() => {
    console.log("🔴", isDone.value); // VS --------- Remove Log
    return {
      opacity: withTiming(isDone.value ? 1 : 0, { easing: EASING }),
      pointerEvents: isDone.value ? "auto" : "none",
      transform: [{ scale: withTiming(isDone.value ? 1 : 0.5, { easing: EASING }) }],
    };
  });

  return (
    <Animated.View style={[rContainerStyle, StyleSheet.absoluteFill]} className="z-50 justify-end">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl mb-4">💥</Text>
        <Text className="text-3xl font-bold text-neutral-200">Boom. You're up to</Text>
        <Text className="text-3xl font-bold text-neutral-200">date.</Text>
      </View>
      <Pressable
        className="p-4 bg-emerald-900 rounded-2xl items-center justify-center"
        style={styles.borderCurve}
        onPress={() => {
          resetStore();
          isDone.set(false);
        }}
      >
        <Text className="text-lg font-semibold text-neutral-200">Done</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
