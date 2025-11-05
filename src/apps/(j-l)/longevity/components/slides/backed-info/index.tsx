import React, { FC } from "react";
import { View } from "react-native";
import { UpdatedTodayText } from "./updated-today-text";
import { TemperaturesText } from "./temperatures-text";
import { PodcastsText } from "./podcasts-text";

export const BackedInfo: FC = () => {
  return (
    <View className="flex-1">
      <UpdatedTodayText />
      <TemperaturesText />
      <PodcastsText />
    </View>
  );
};
