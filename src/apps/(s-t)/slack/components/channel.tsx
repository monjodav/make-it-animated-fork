import React, { FC } from "react";
import { View } from "react-native";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { MarkView } from "./mark-view";

export const Channel: FC = () => {
  return (
    <ChannelAnimationProvider>
      <View className="flex-1 bg-stone-800 rounded-3xl justify-center px-5">
        <View className="flex-row items-center justify-between">
          <MarkView variant="keep-read" />
          <MarkView variant="keep-unread" />
        </View>
      </View>
    </ChannelAnimationProvider>
  );
};
