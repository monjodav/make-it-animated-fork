import React, { FC } from "react";
import { View } from "react-native";
import { RedCard } from "./red-card";
import { BlueCard } from "./blue-card";
import { StoneCard } from "./stone-card";
import { ProtocolsText } from "./protocols-text";

const SLIDE_INDEX = 0;

export const Welcome: FC = () => {
  return (
    <View className="flex-1">
      <BlueCard index={SLIDE_INDEX} />
      <StoneCard index={SLIDE_INDEX} />
      <RedCard index={SLIDE_INDEX} />
      <ProtocolsText index={SLIDE_INDEX} />
    </View>
  );
};
