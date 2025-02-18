import { measure, useAnimatedRef, useDerivedValue, useSharedValue } from "react-native-reanimated";

export const useTriggerMeasurement = () => {
  const triggerRef = useAnimatedRef();
  const isTriggerMounted = useSharedValue(false);

  const measurement = useDerivedValue(() => {
    if (isTriggerMounted.value === false) {
      return null;
    }

    const measurement = measure(triggerRef);

    if (measurement === null) {
      return null;
    }

    return measurement;
  });

  const onLayout = () => {
    if (isTriggerMounted.value === false) {
      isTriggerMounted.value = true;
    }
  };

  return { measurement, triggerRef, onLayout };
};
