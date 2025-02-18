import React, { FC } from "react";
import { View } from "react-native";
import { JobItem } from "./job-item";

export const JobSection: FC = () => {
  return (
    <View className="px-4 py-4 gap-4 bg-linkedin-back">
      <JobItem />
      <View className="h-px bg-linkedin-front" />
      <JobItem />
      <View className="h-px bg-linkedin-front" />
      <JobItem />
    </View>
  );
};
