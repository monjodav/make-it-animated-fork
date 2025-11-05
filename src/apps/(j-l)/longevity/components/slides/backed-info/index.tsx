import React, { FC } from "react";
import { UpdatedTodayText } from "./updated-today-text";
import { TemperaturesText } from "./temperatures-text";
import { PodcastsText } from "./podcasts-text";
import { SlideContainer } from "../../slide-container";

// longevity-onboarding-animation 🔽

const SLIDE_INDEX = 2;

export const BackedInfo: FC = () => {
  return (
    <SlideContainer index={SLIDE_INDEX}>
      <UpdatedTodayText index={SLIDE_INDEX} />
      <TemperaturesText index={SLIDE_INDEX} />
      <PodcastsText index={SLIDE_INDEX} />
    </SlideContainer>
  );
};

// longevity-onboarding-animation 🔼
