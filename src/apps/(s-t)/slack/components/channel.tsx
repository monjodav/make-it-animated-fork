import React, { FC } from "react";
import { View } from "react-native";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { MarkView } from "./mark-view";
import { Chat } from "./chat";
import { ChannelContainer } from "./channel-container";
import { ColorBackground } from "./color-background";
import { Channel as ChannelType } from "../lib/types";
import { SharedValue } from "react-native-reanimated";

type Props = {
  channel: ChannelType;
  index: number;
  total: number;
  activeChannelIndex: SharedValue<number>;
};

export const Channel: FC<Props> = ({ channel, index, total, activeChannelIndex }) => {
  return (
    <ChannelAnimationProvider index={index} activeChannelIndex={activeChannelIndex} total={total}>
      <ChannelContainer index={index} activeChannelIndex={activeChannelIndex} total={total}>
        <Chat channel={channel} />
        <ColorBackground />
        <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between pointer-events-none">
          <MarkView variant="keep-read" />
          <MarkView variant="keep-unread" />
        </View>
      </ChannelContainer>
    </ChannelAnimationProvider>
  );
};
