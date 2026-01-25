import { createContext, FC, useCallback, useContext } from "react";
import type { DigitalCounterContextValue, DigitalCounterProviderProps } from "./types/daily-steps";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

// daily-steps-counter-animation 🔽

// Extracts individual digits from counter value, padding with leading zeros
// Example: value=5000, max=32000 → [5, 0, 0, 0]
// Worklet annotation allows execution on UI thread for performance
const getDigits = (value: number, max: number): number[] => {
  "worklet";
  const maxLength = max.toString().length;
  const counterString = Math.floor(value).toString();
  const digits = Array.from(counterString, (digit) => parseInt(digit, 10));

  // Pad with leading zeros to match max value's digit count
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
  // Shared values coordinate state across all wheel components
  // counter: current numeric value
  // previousCounter: value before last change (for transition detection)
  // direction: animation direction (increase/decrease)
  // currentWheelDigits/previousWheelDigits: digit arrays for each wheel position
  const counter = useSharedValue(min);
  const previousCounter = useSharedValue(0);

  const direction = useSharedValue<"increase" | "decrease">("increase");

  const currentWheelDigits = useSharedValue<number[]>([]);
  const previousWheelDigits = useSharedValue<number[]>([]);

  // Synchronizes digit arrays when counter changes
  // Runs on UI thread (worklet) for smooth animation coordination
  // Updates both current and previous digit arrays for transition detection
  useAnimatedReaction(
    () => counter.get(),
    (value) => {
      const currentDigits = getDigits(value, max);
      const previousDigits = getDigits(previousCounter.get(), max);

      currentWheelDigits.set(currentDigits);
      previousWheelDigits.set(previousDigits);
    },
  );

  // Increment handler: sets direction, updates previous value, then updates counter
  // Clamps to max value to prevent overflow
  // Math.floor ensures integer values for digit extraction
  const handleIncrement = useCallback(() => {
    direction.set("increase");
    previousCounter.set(counter.get());

    const newValue = Math.min(max, Math.floor(counter.get()) + step);
    counter.set(newValue);

    if (onValueChange) {
      onValueChange?.(newValue);
    }
  }, [direction, counter, previousCounter, max, step, onValueChange]);

  // Decrement handler: sets direction, updates previous value, then updates counter
  // Clamps to min value to prevent underflow
  // Math.ceil ensures integer values for digit extraction
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
