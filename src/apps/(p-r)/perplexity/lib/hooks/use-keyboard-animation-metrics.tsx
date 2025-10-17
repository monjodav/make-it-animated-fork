import { useEffect } from "react";
import { KeyboardEvents, useKeyboardHandler } from "react-native-keyboard-controller";
import { useSharedValue } from "react-native-reanimated";

export const useKeyboardAnimationMetrics = () => {
  const keyboardHeightProgress = useSharedValue(0);
  const keyboardFinalHeight = useSharedValue(0);
  const keyboardIsShowing = useSharedValue(0);

  useEffect(() => {
    const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      keyboardFinalHeight.set(Math.abs(e.height));
      keyboardIsShowing.set(1);
    });
    const hide = KeyboardEvents.addListener("keyboardWillHide", () => {
      keyboardIsShowing.set(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        keyboardHeightProgress.set(e.height);
      },
      onEnd: (e) => {
        "worklet";
        keyboardHeightProgress.set(e.height);
      },
    },
    []
  );
  return { keyboardHeightProgress, keyboardFinalHeight, keyboardIsShowing };
};
