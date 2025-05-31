import React, { FC } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useUnreadAnimation } from "../lib/provider/unread-animation";
import * as Haptics from "expo-haptics";

export const UnreadFooter: FC = () => {
  const { isKeepUnreadPressed, isMarkAsReadPressed } = useUnreadAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    const disabled = isKeepUnreadPressed.get() || isMarkAsReadPressed.get();

    return {
      pointerEvents: disabled ? "none" : "auto",
    };
  });

  return (
    <Animated.View className="flex-row gap-5 pt-6 items-center" style={rContainerStyle}>
      <Pressable
        className="flex-1 p-[14px] bg-neutral-900 border border-neutral-700/50 rounded-2xl items-center justify-center"
        style={styles.borderCurve}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          isKeepUnreadPressed.set(true);
        }}
      >
        <Text className="text-lg font-semibold text-neutral-300">Keep Unread</Text>
      </Pressable>
      <Pressable
        className="flex-1 p-[12px] bg-emerald-900 border border-emerald-700/50 rounded-2xl items-center justify-center"
        style={styles.borderCurve}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          isMarkAsReadPressed.set(true);
        }}
      >
        <Text className="text-lg font-semibold text-neutral-300">Mark as Read</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
