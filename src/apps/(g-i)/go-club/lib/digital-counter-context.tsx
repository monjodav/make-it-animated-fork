import { createContext, FC, useCallback, useContext } from "react";
import type { DigitalCounterContextValue, DigitalCounterProviderProps } from "./types";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const DigitalCounterContext = createContext<DigitalCounterContextValue | undefined>(undefined);

export const DigitalCounterProvider: FC<DigitalCounterProviderProps> = ({
  min,
  max,
  step,
  onValueChange,
  children,
}) => {
  const counter = useSharedValue(0);

  useAnimatedReaction(
    () => counter.get(),
    (value) => {
      if (onValueChange) {
        scheduleOnRN(onValueChange, value);
      }
    },
  );

  const handleIncrement = useCallback(() => {
    counter.set(Math.min(max, Math.floor(counter.get()) + step));
  }, [counter, max, step]);

  const handleDecrement = useCallback(() => {
    counter.set(Math.max(min, Math.ceil(counter.get()) - step));
  }, [counter, min, step]);

  const contextValue: DigitalCounterContextValue = {
    min,
    max,
    step,
    onValueChange,
    handleIncrement,
    handleDecrement,
  };

  return (
    <DigitalCounterContext.Provider value={contextValue}>{children}</DigitalCounterContext.Provider>
  );
};

export const useDigitalCounter = () => {
  const context = useContext(DigitalCounterContext);

  if (!context) {
    throw new Error("useDigitalCounter must be used within a DigitalCounterProvider");
  }

  return context;
};
