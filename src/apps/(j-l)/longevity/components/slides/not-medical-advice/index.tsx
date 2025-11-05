import React, { FC } from "react";
import { View } from "react-native";
import { AttentionText } from "./attention-text";
import { BlueCard } from "./blue-card";
import { StoneCard } from "./stone-card";

export const NotMedicalAdvice: FC = () => {
  return (
    <View className="flex-1">
      <StoneCard />
      <BlueCard />
      <AttentionText />
    </View>
  );
};
