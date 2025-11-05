import React, { FC } from "react";
import { View } from "react-native";
import { HbotText } from "./hbot-text";
import { BlueCard } from "./blue-card";
import { StoneCard } from "./stone-card";
import { SlideContainer } from "../../slide-container";

export const Share: FC = () => {
  return (
    <SlideContainer index={3}>
      <StoneCard />
      <BlueCard />
      <HbotText />
    </SlideContainer>
  );
};
