import React, { FC } from "react";
import { View } from "react-native";
import { RedCard } from "./red-card";
import { BlueCard } from "./blue-card";
import { StoneCard } from "./stone-card";
import { ProtocolsText } from "./protocols-text";

export const Welcome: FC = () => {
  return (
    <View className="flex-1">
      <BlueCard />
      <StoneCard />
      <RedCard />
      <ProtocolsText />
    </View>
  );
};
