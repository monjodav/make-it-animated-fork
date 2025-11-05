import React, { FC } from "react";
import { View } from "react-native";
import { StoneCard } from "./stone-card";
import { FivePerWeekText } from "./five-per-week-text";
import { EightyThreeIsBetterText } from "./eighty-three-is-better";
import { OnceAWeekText } from "./once-a-week-text";
import { HundredTenIsBetterText } from "./hundred-ten-is-better-text";
import { SlideContainer } from "../../slide-container";

export const Essentials: FC = () => {
  return (
    <SlideContainer index={1}>
      <FivePerWeekText />
      <OnceAWeekText />
      <HundredTenIsBetterText />
      <StoneCard />
      <EightyThreeIsBetterText />
    </SlideContainer>
  );
};
