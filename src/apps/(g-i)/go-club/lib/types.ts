import type { PropsWithChildren } from "react";
import { SharedValue } from "react-native-reanimated";

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

export type WheelDirection = "increase" | "decrease" | "idle";
