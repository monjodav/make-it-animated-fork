import React, { FC } from "react";
import { useDigitalCounter } from "../../lib/digital-counter-context";
import { DigitalWheel } from "./digital-wheel";
import Animated, { LinearTransition } from "react-native-reanimated";

export const DigitalCounter: FC = () => {
  const { max } = useDigitalCounter();

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      className="flex-row items-center justify-center"
    >
      {Array.from({ length: max.toString().length }).map((_, index) => (
        <DigitalWheel key={index} index={index} />
      ))}
    </Animated.View>
  );
};
