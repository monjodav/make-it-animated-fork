import React, { FC } from "react";
import { View } from "react-native";
import { StoneCard } from "./stone-card";
import { FivePerWeekText } from "./five-per-week-text";
import { EightyThreeIsBetterText } from "./eighty-three-is-better";
import { OnceAWeekText } from "./once-a-week-text";
import { HundredTenIsBetterText } from "./hundred-ten-is-better-text";

export const Essentials: FC = () => {
  return (
    <View className="flex-1">
      <FivePerWeekText />
      <OnceAWeekText />
      <HundredTenIsBetterText />
      <StoneCard />
      <EightyThreeIsBetterText />
    </View>
  );
};
