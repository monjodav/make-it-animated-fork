import React, { FC } from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import { withTiming } from "react-native-reanimated";

export const ChannelFooter: FC = () => {
  const { width } = useWindowDimensions();
  const { handlePopChannel, panX, activeChannelIndex } = useChannelAnimation();

  const handleKeepUnread = () => {
    panX.set(withTiming(-width * 2));
    activeChannelIndex.set(activeChannelIndex.value - 1);
    handlePopChannel("unread");
  };

  const handleMarkAsRead = () => {
    panX.set(withTiming(width * 2));
    activeChannelIndex.set(activeChannelIndex.value - 1);
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
