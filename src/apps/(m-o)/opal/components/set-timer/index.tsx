import React, { FC } from "react";
import { View } from "react-native";
import { Stepper } from "./stepper";
import { TimerStep } from "../../lib/types";
import { Slider } from "./slider";
import { useSharedValue } from "react-native-reanimated";

const MINUTES: TimerStep[] = Array.from({ length: 13 }, (_, index) => ({
  id: index * 5,
  value: index * 5,
}));

const HOURS: TimerStep[] = Array.from({ length: 23 }, (_, index) => ({
  id: (index + 2) * 60,
  value: (index + 2) * 60,
}));

const DATA: TimerStep[] = [...MINUTES, ...HOURS];

export const SetTimer: FC = () => {
  const value = useSharedValue<number>(0);

  return (
    <View className="gap-4">
      <Stepper data={DATA} value={value} />
      <Slider data={DATA} value={value} />
    </View>
  );
};
