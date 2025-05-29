import React, { FC } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import { withTiming } from "react-native-reanimated";

const DURATION = 600;

export const UnreadFooter: FC = () => {
  const { width } = useWindowDimensions();
  const { handlePopChannel, panX, panY, isDragging, activeChannelIndex } = useChannelAnimation();

  const handleKeepUnread = () => {
    isDragging.set(true);
    panY.set(0);
    panX.set(withTiming(-width * 2, { duration: DURATION }));
    activeChannelIndex.set(withTiming(activeChannelIndex.value - 1, { duration: DURATION }));
    handlePopChannel("unread");
  };

  const handleMarkAsRead = () => {
    isDragging.set(true);
    panY.set(0);
    panX.set(withTiming(width * 2, { duration: DURATION }));
    activeChannelIndex.set(withTiming(activeChannelIndex.value - 1, { duration: DURATION }));
    handlePopChannel("read");
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
