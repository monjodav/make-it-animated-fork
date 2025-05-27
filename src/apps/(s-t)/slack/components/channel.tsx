import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { MarkView } from "./mark-view";
import { Chat } from "./chat";

export const Channel: FC = () => {
  return (
    <ChannelAnimationProvider>
      <View
        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-3xl"
        style={styles.borderCurve}
      >
        <Chat />
        <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between pointer-events-none">
          <MarkView variant="keep-read" />
          <MarkView variant="keep-unread" />
        </View>
      </View>
    </ChannelAnimationProvider>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
