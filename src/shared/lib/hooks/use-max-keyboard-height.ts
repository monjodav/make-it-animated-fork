import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

export const useMaxKeyboardHeight = () => {
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const maxKeyboardHeight = useSharedValue(0);

  useAnimatedReaction(
    () => keyboardHeight.get(),
    (height) => {
      if (Math.abs(height) > maxKeyboardHeight.get()) {
        maxKeyboardHeight.set(Math.abs(height));
      }
    }
  );

  return maxKeyboardHeight;
};
