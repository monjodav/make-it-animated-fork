import React, { FC } from "react";
import { useDigitalCounter } from "../../lib/digital-counter-context";
import { DigitalWheel } from "./digital-wheel";
import { View } from "react-native";

// daily-steps-counter-animation 🔽

// Main counter component: renders one DigitalWheel per digit position
// Creates wheels dynamically based on max value's digit count
// marginRight on index 1 creates visual spacing between digit groups (e.g., "10,000")
export const DigitalCounter: FC = () => {
  const { max } = useDigitalCounter();

  return (
    <View className="flex-row items-center justify-center self-start">
      {Array.from({ length: max.toString().length }).map((_, index) => (
        <DigitalWheel key={index} index={index} />
      ))}
    </View>
  );
};

// daily-steps-counter-animation 🔼
