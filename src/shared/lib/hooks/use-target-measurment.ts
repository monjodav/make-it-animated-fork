import { Platform } from "react-native";
import { measure, useAnimatedRef, useDerivedValue, useSharedValue } from "react-native-reanimated";

export const useTargetMeasurement = () => {
  const targetRef = useAnimatedRef();
  const isTargetMounted = useSharedValue(false);

  const measurement = useDerivedValue(() => {
    if (isTargetMounted.value === false) {
      return null;
    }

    const measurement = measure(targetRef);

    return measurement;
  });

  const onTargetLayout = () => {
    if (isTargetMounted.value === false) {
      if (Platform.OS === "android") {
        setTimeout(() => {
          isTargetMounted.value = true;
        }, 500);
      }
      isTargetMounted.value = true;
    }
  };

  return { measurement, targetRef, onTargetLayout };
};
