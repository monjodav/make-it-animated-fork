import { runOnJS, useAnimatedReaction, withSpring, withTiming } from "react-native-reanimated";
import { useChannelAnimation } from "../provider/channel-animation";
import { useUnreadAnimation } from "../provider/unread-animation";

const DURATION = 300;

const ANIM_CONFIG = {
  stiffness: 320,
  damping: 28,
};

export const useHeaderControlsAnimation = (index: number) => {
  const { currentChannelIndex, prevChannelIndex, isUndoPressed, isIncreasing } =
    useUnreadAnimation();
  const { panX, panY, absoluteYAnchor, handleChannelStatus } = useChannelAnimation();

  const resetUndoPressed = () => {
    setTimeout(() => {
      isUndoPressed.set(false);
    }, 250);
  };

  useAnimatedReaction(
    () => {
      return {
        isUndoPressedValue: isUndoPressed.value,
      };
    },
    ({ isUndoPressedValue }) => {
      if (index !== Math.round(currentChannelIndex.get() + 1)) {
        return;
      }
      if (isUndoPressedValue) {
        isIncreasing.set(true);
        absoluteYAnchor.set(0);
        prevChannelIndex.set(Math.round(currentChannelIndex.get() + 1));
        currentChannelIndex.set(withTiming(currentChannelIndex.value + 1, { duration: DURATION }));
        panX.set(withSpring(0, ANIM_CONFIG));
        panY.set(withSpring(0, ANIM_CONFIG));
        runOnJS(handleChannelStatus)("unread");
        runOnJS(resetUndoPressed)();
      }
    }
  );
};
