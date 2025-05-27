import React, { FC } from "react";
import { View } from "react-native";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { MarkView } from "./mark-view";
import { Chat } from "./chat";
import { ChannelContainer } from "./channel-container";

export const Channel: FC = () => {
  return (
    <ChannelAnimationProvider>
      <ChannelContainer>
        <Chat />
        <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between pointer-events-none">
          <MarkView variant="keep-read" />
          <MarkView variant="keep-unread" />
        </View>
      </ChannelContainer>
    </ChannelAnimationProvider>
  );
};
