// daily-steps-counter-animation 🔽

import type { PropsWithChildren } from "react";
import { SharedValue } from "react-native-reanimated";

// Context value type: all shared values and handlers for counter state
// SharedValue types enable UI thread animations without JS bridge overhead
export type DigitalCounterContextValue = {
  counter: SharedValue<number>;
  previousCounter: SharedValue<number>;
  currentWheelDigits: SharedValue<number[]>;
  previousWheelDigits: SharedValue<number[]>;
  direction: SharedValue<"increase" | "decrease">;
  min: number;
  max: number;
  step: number;
  onValueChange?: (value: number) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
};

export type DigitalCounterProviderProps = PropsWithChildren & {
  min: number;
  max: number;
  step: number;
  onValueChange?: (value: number) => void;
};

// Wheel direction: controls animation direction and state
// "idle" = no animation, "increase" = upward transition, "decrease" = downward transition
export type WheelDirection = "increase" | "decrease" | "idle";

// daily-steps-counter-animation 🔼
