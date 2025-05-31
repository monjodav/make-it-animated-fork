import React, { FC } from "react";
import { View } from "react-native";
import { useUnreadStore } from "../lib/store/unread";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { Channel } from "./channel";

export const UnreadChannels: FC = () => {
  const unreadChannels = useUnreadStore.use.unreadChannels();

  return (
    <View className="flex-1">
      {unreadChannels.map((channel, index) => (
        <ChannelAnimationProvider key={channel.id}>
          <Channel channel={channel} index={index} />
        </ChannelAnimationProvider>
      ))}
    </View>
  );
};
