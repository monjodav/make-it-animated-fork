import React, { FC } from "react";
import { View } from "react-native";
import { AttentionText } from "./attention-text";
import { BlueCard } from "./blue-card";
import { StoneCard } from "./stone-card";
import { SlideContainer } from "../../slide-container";

export const NotMedicalAdvice: FC = () => {
  return (
    <SlideContainer index={4}>
      <StoneCard />
      <BlueCard />
      <AttentionText />
    </SlideContainer>
  );
};
