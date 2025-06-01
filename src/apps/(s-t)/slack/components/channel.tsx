import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { MarkView } from "./mark-view";
import { Chat } from "./chat";
import ChannelContainer from "./channel-container";
import { ColorBackground } from "./color-background";
import { Channel as ChannelType } from "../lib/types";
import { useUnreadAnimation } from "../lib/provider/unread-animation";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

// slack-catch-up-cards-swipe-animation 🔽

type Props = {
  channel: ChannelType;
  index: number;
};

export const Channel: FC<Props> = ({ channel, index }) => {
  const { isDragging } = useUnreadAnimation();

  const rSwipeIndicationContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDragging.get() ? 1 : 0, { duration: 150 }),
    };
  });

  return (
    <ChannelContainer index={index}>
      <Chat channel={channel} />
      <Animated.View
        style={[StyleSheet.absoluteFill, rSwipeIndicationContainerStyle]}
        className="pointer-events-none"
      >
        <ColorBackground />
        <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between">
          <MarkView variant="keep-read" />
          <MarkView variant="keep-unread" />
        </View>
      </Animated.View>
    </ChannelContainer>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
