import React, { FC } from "react";
import { View } from "react-native";
import { HbotText } from "./hbot-text";
import { BlueCard } from "./blue-card";
import { StoneCard } from "./stone-card";

export const Share: FC = () => {
  return (
    <View className="flex-1">
      <StoneCard />
      <BlueCard />
      <HbotText />
    </View>
  );
};
