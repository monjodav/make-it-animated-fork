import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUnreadStore } from "../lib/store/unread";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { UnreadFooter } from "../components/unread-footer";
import { UnreadHeader } from "../components/unread-header";
import { UnreadDone } from "../components/unread-done";
import { UnreadAnimationProvider } from "../lib/provider/unread-animation";

export const Unread: FC = () => {
  const insets = useSafeAreaInsets();

  const unreadChannels = useUnreadStore.use.unreadChannels();

  return (
    <UnreadAnimationProvider>
      <View
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
      >
        <LinearGradient colors={["#013D60", "#001A2C"]} style={StyleSheet.absoluteFill} />
        <UnreadHeader />
        <View className="flex-1">
          <View className="flex-1">
            {unreadChannels.map((channel, index) => (
              <ChannelAnimationProvider key={channel.id}>
                <Channel channel={channel} index={index} />
              </ChannelAnimationProvider>
            ))}
          </View>
          <UnreadFooter />
          <UnreadDone />
        </View>
      </View>
    </UnreadAnimationProvider>
  );
};
