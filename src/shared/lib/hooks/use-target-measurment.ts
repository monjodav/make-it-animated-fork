import { useEffect, useState } from "react";
import {
  measure,
  MeasuredDimensions,
  runOnUI,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";

export const useTargetMeasurement = () => {
  const [isTargetMounted, setIsTargetMounted] = useState(false);
  const targetRef = useAnimatedRef();

  const measurement = useSharedValue<MeasuredDimensions | null>(null);

  const handleMeasurement = () => {
    runOnUI(() => {
      const result = measure(targetRef);
      if (result === null) {
        return;
      }
      measurement.value = result;
    })();
  };

  useEffect(() => {
    if (isTargetMounted) {
      setTimeout(() => {
        handleMeasurement();
      }, 1000); // Wait for sure the target to be mounted
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTargetMounted]);

  const onTargetLayout = () => {
    if (isTargetMounted === false) {
      setIsTargetMounted(true);
    }
  };

  return { measurement, targetRef, onTargetLayout };
};
