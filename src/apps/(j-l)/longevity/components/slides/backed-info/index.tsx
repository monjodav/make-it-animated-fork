import React, { FC } from "react";
import { UpdatedTodayText } from "./updated-today-text";
import { TemperaturesText } from "./temperatures-text";
import { PodcastsText } from "./podcasts-text";
import { SlideContainer } from "../../slide-container";

export const BackedInfo: FC = () => {
  return (
    <SlideContainer index={2}>
      <UpdatedTodayText />
      <TemperaturesText />
      <PodcastsText />
    </SlideContainer>
  );
};
