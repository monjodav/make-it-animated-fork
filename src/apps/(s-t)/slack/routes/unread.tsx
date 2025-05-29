import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUnreadStore } from "../lib/store/unread";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { UnreadFooter } from "../components/unread-footer";
import { UnreadHeader } from "../components/unread-header";

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  const unreadChannels = useUnreadStore.use.unreadChannels();

  return (
    <ChannelAnimationProvider total={unreadChannels.length}>
      <View
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
      >
        <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
        <UnreadHeader total={unreadChannels.length} />
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
        <UnreadFooter />
      </View>
    </ChannelAnimationProvider>
  );
};
