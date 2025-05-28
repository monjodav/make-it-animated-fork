import React, { FC } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useSharedValue } from "react-native-reanimated";
import { useUnreadStore } from "../lib/store/unread";

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  const unreadChannels = useUnreadStore.use.unreadChannels();

  const activeChannelIndex = useSharedValue(unreadChannels.length - 1);

  return (
    <View className="flex-1 px-5" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
      <View className="flex-1">
        {unreadChannels.map((channel, index) => (
          <Channel
            key={channel.id}
            channel={channel}
            index={index}
            total={unreadChannels.length}
            activeChannelIndex={activeChannelIndex}
          />
        ))}
      </View>
      <View className="flex-row gap-5 pt-6 items-center">
        <Pressable
          className="flex-1 p-[14px] bg-neutral-900 border border-neutral-700/50 rounded-2xl items-center justify-center"
          style={styles.borderCurve}
        >
          <Text className="text-lg font-semibold text-neutral-300">Keep Unread</Text>
        </Pressable>
        <Pressable
          className="flex-1 p-[12px] bg-emerald-900 border border-emerald-700/50 rounded-2xl items-center justify-center"
          style={styles.borderCurve}
        >
          <Text className="text-lg font-semibold text-neutral-300">Mark as Read</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
