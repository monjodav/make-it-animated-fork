import React, { FC } from "react";
import { View } from "react-native";
import { Channel } from "../components/channel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

export const Unread: FC<Props> = ({}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-stone-800 px-5"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Channel />
    </View>
  );
};
