import React, { FC } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Channel as ChannelType } from "../lib/types";
import { useSharedValue } from "react-native-reanimated";

const unreadChannels: ChannelType[] = [
  {
    id: "1",
    name: "channel-1",
    data: Array.from({ length: 20 }, (_, i) => i),
  },
  {
    id: "2",
    name: "channel-2",
    data: Array.from({ length: 20 }, (_, i) => i),
  },
  {
    id: "3",
    name: "channel-3",
    data: Array.from({ length: 20 }, (_, i) => i),
  },
  {
    id: "4",
    name: "channel-4",
    data: Array.from({ length: 20 }, (_, i) => i),
  },
  {
    id: "5",
    name: "channel-5",
    data: Array.from({ length: 20 }, (_, i) => i),
  },
];

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  const activeChannelIndex = useSharedValue(0);

  return (
    <View className="flex-1 px-5" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
      <View className="flex-1">
        {unreadChannels.map((channel, index) => (
          <Channel
            key={channel.id}
            channel={channel}
            index={index}
            activeChannelIndex={activeChannelIndex}
          />
        ))}
      </View>
      <View className="flex-row gap-5 pt-5 items-center">
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
