import type { PressableProps, ViewProps } from "react-native";
import type { ReactNode } from "react";

export interface ItemMeasurements {
  width: number;
  height: number;
  x: number;
}

export interface SegmentedControlContextValue {
  value: string;
  onValueChange: (value: string) => void;
  measurements: Record<string, ItemMeasurements>;
  setMeasurements: (key: string, measurements: ItemMeasurements) => void;
}

export interface SegmentedControlProps extends ViewProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export interface SegmentedControlItemProps extends Omit<PressableProps, "children"> {
  value: string;
  className?: string;
  children?: ReactNode | ((params: { isActive: boolean }) => ReactNode);
  pressScale?: number;
}

export interface SegmentedControlIndicatorProps extends ViewProps {
  className?: string;
}
