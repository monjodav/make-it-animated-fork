import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUnreadStore } from "../lib/store/unread";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { ChannelFooter } from "../components/channel-footer";

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  const unreadChannels = useUnreadStore.use.unreadChannels();

  return (
    <ChannelAnimationProvider total={unreadChannels.length}>
      <View
        className="flex-1 px-5"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
        <View className="flex-1">
          {unreadChannels.map((channel, index) => (
            <Channel
              key={channel.id}
              channel={channel}
              index={index}
              total={unreadChannels.length}
            />
          ))}
        </View>
        <ChannelFooter />
      </View>
    </ChannelAnimationProvider>
  );
};
