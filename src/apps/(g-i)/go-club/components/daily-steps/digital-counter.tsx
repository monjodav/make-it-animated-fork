import React, { FC } from "react";
import { useDigitalCounter } from "../../lib/digital-counter-context";
import { DigitalWheel } from "./digital-wheel";
import { View } from "react-native";

export const DigitalCounter: FC = () => {
  const { max } = useDigitalCounter();

  return (
    <View className="flex-row items-center justify-center self-start">
      {Array.from({ length: max.toString().length }).map((_, index) => (
        <DigitalWheel key={index} index={index} marginRight={index === 1 ? 16 : 0} />
      ))}
    </View>
  );
};
