import { measure, useAnimatedRef, useDerivedValue, useSharedValue } from "react-native-reanimated";

export const useTargetMeasurement = () => {
  const targetRef = useAnimatedRef();
  const isTargetMounted = useSharedValue(false);

  const measurement = useDerivedValue(() => {
    if (isTargetMounted.value === false) {
      return null;
    }

    const measurement = measure(targetRef);

    if (measurement === null) {
      return null;
    }

    return measurement;
  });

  const onLayout = () => {
    if (isTargetMounted.value === false) {
      isTargetMounted.value = true;
    }
  };

  return { measurement, targetRef, onLayout };
};
