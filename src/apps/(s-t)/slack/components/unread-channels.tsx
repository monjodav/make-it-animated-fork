import React, { FC, memo, useMemo } from "react";
import { View } from "react-native";
import { useUnreadStore } from "../lib/store/unread";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { Channel } from "./channel";
import { Channel as ChannelType } from "../lib/types";

type Props = {
  unreadChannels: ChannelType[];
};

const MemoizedListOfChannels: FC<Props> = memo(({ unreadChannels }) => {
  return (
    <View className="flex-1">
      {unreadChannels.map((channel, index) => (
        <ChannelAnimationProvider key={channel.id}>
          <Channel channel={channel} index={index} />
        </ChannelAnimationProvider>
      ))}
    </View>
  );
});

MemoizedListOfChannels.displayName = "MemoizedListOfChannels";

export const UnreadChannels: FC = () => {
  const unreadChannels = useUnreadStore.use.unreadChannels();

  // For display purposes I don't really care about channel status as It can be set in background
  // so I'm memoizing it to prevent unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => unreadChannels, []);

  return <MemoizedListOfChannels unreadChannels={data} />;
};
