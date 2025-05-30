import React, { FC } from "react";
import { View } from "react-native";
import { MarkView } from "./mark-view";
import { Chat } from "./chat";
import { ChannelContainer } from "./channel-container";
import { ColorBackground } from "./color-background";
import { Channel as ChannelType } from "../lib/types";

type Props = {
  channel: ChannelType;
  index: number;
};

export const Channel: FC<Props> = ({ channel, index }) => {
  return (
    <ChannelContainer index={index}>
      <Chat channel={channel} />
      <ColorBackground />
      <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between pointer-events-none">
        <MarkView variant="keep-read" />
        <MarkView variant="keep-unread" />
      </View>
    </ChannelContainer>
  );
};
