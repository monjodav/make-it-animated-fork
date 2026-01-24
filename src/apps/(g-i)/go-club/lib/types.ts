import type { PropsWithChildren } from "react";

export type DigitalCounterContextValue = {
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
