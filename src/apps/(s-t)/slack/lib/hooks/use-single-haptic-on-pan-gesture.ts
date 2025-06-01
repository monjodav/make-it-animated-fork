import { runOnJS, useSharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

// slack-catch-up-cards-swipe-animation 🔽

type Params = {
  triggerOffset: number;
  axis: "x" | "y";
};

export const useSingleHapticOnPanGesture = ({ triggerOffset, axis }: Params) => {
  const isHapticTriggered = useSharedValue(false);

  const handleHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isHapticTriggered.set(true);
  };

  // We insert singleHapticOnChange in onChange of the gesture to be able to trigger haptics when we pan the card more than triggerOffset
  const singleHapticOnChange = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>
  ) => {
    "worklet";

    const offset = axis === "x" ? event.translationX : event.translationY;

    if (Math.abs(offset) > triggerOffset && !isHapticTriggered.value) {
      runOnJS(handleHaptics)();
    }

    if (Math.abs(offset) < triggerOffset && isHapticTriggered.value) {
      isHapticTriggered.set(false);
    }
  };

  return { singleHapticOnChange };
};

// slack-catch-up-cards-swipe-animation 🔼
