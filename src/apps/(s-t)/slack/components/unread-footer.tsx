import React, { FC } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { withTiming } from "react-native-reanimated";
import { useUnreadAnimation } from "../lib/provider/unread-animation";

const DURATION = 600;

export const UnreadFooter: FC = () => {
  const { currentChannelIndex, isDragging } = useUnreadAnimation();

  const handleKeepUnread = () => {
    isDragging.set(true);
    currentChannelIndex.set(withTiming(currentChannelIndex.value - 1, { duration: DURATION }));
  };

  const handleMarkAsRead = () => {
    isDragging.set(true);
    currentChannelIndex.set(withTiming(currentChannelIndex.value - 1, { duration: DURATION }));
  };

  return (
    <View className="flex-row gap-5 pt-6 items-center">
      <Pressable
        className="flex-1 p-[14px] bg-neutral-900 border border-neutral-700/50 rounded-2xl items-center justify-center"
        style={styles.borderCurve}
        onPress={handleKeepUnread}
      >
        <Text className="text-lg font-semibold text-neutral-300">Keep Unread</Text>
      </Pressable>
      <Pressable
        className="flex-1 p-[12px] bg-emerald-900 border border-emerald-700/50 rounded-2xl items-center justify-center"
        style={styles.borderCurve}
        onPress={handleMarkAsRead}
      >
        <Text className="text-lg font-semibold text-neutral-300">Mark as Read</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
