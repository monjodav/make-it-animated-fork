import { createContext, FC, useCallback, useContext } from "react";
import type { DigitalCounterContextValue, DigitalCounterProviderProps } from "./types/daily-steps";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

// daily-steps-counter-animation 🔽

const getDigits = (value: number, max: number): number[] => {
  "worklet";
  const maxLength = max.toString().length;
  const counterString = Math.floor(value).toString();
  const digits = Array.from(counterString, (digit) => parseInt(digit, 10));

  while (digits.length < maxLength) {
    digits.push(0);
  }

  return digits;
};

const DigitalCounterContext = createContext<DigitalCounterContextValue | undefined>(undefined);

export const DigitalCounterProvider: FC<DigitalCounterProviderProps> = ({
  min,
  max,
  step,
  onValueChange,
  children,
}) => {
  const counter = useSharedValue(min);
  const previousCounter = useSharedValue(0);

  const direction = useSharedValue<"increase" | "decrease">("increase");

  const currentWheelDigits = useSharedValue<number[]>([]);
  const previousWheelDigits = useSharedValue<number[]>([]);

  useAnimatedReaction(
    () => counter.get(),
    (value) => {
      const currentDigits = getDigits(value, max);
      const previousDigits = getDigits(previousCounter.get(), max);

      currentWheelDigits.set(currentDigits);
      previousWheelDigits.set(previousDigits);
    },
  );

  const handleIncrement = useCallback(() => {
    direction.set("increase");
    previousCounter.set(counter.get());

    const newValue = Math.min(max, Math.floor(counter.get()) + step);
    counter.set(newValue);

    if (onValueChange) {
      onValueChange?.(newValue);
    }
  }, [direction, counter, previousCounter, max, step, onValueChange]);

  const handleDecrement = useCallback(() => {
    direction.set("decrease");
    previousCounter.set(counter.get());

    const newValue = Math.max(min, Math.ceil(counter.get()) - step);
    counter.set(newValue);

    if (onValueChange) {
      onValueChange?.(newValue);
    }
  }, [direction, counter, previousCounter, min, step, onValueChange]);

  const contextValue: DigitalCounterContextValue = {
    counter,
    previousCounter,
    currentWheelDigits,
    previousWheelDigits,
    direction,
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

// daily-steps-counter-animation 🔼
