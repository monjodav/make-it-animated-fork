import { useWindowDimensions } from "react-native";
import { useUnreadAnimation } from "../provider/unread-animation";
import { useChannelAnimation } from "../provider/channel-animation";
import { runOnJS, useAnimatedReaction, withTiming } from "react-native-reanimated";

const DURATION = 500;
const TIMEOUT = 250;

export const useFooterControlsAnimation = (index: number) => {
  const { width } = useWindowDimensions();

  const {
    isDragging,
    currentChannelIndex,
    prevChannelIndex,
    isKeepUnreadPressed,
    isMarkAsReadPressed,
    isDecreasing,
  } = useUnreadAnimation();

  const { panX, absoluteYAnchor, handleChannelStatus } = useChannelAnimation();

  const resetKeepUnreadPressed = () => {
    setTimeout(() => {
      isKeepUnreadPressed.set(false);
      isDragging.set(false);
    }, TIMEOUT);
  };

  const resetMarkAsReadPressed = () => {
    setTimeout(() => {
      isMarkAsReadPressed.set(false);
      isDragging.set(false);
    }, TIMEOUT);
  };

  const onButtonPressed = () => {
    "worklet";
    isDragging.set(true);
    isDecreasing.set(true);
    absoluteYAnchor.set(0);
    prevChannelIndex.set(Math.round(currentChannelIndex.get() - 1));
    currentChannelIndex.set(withTiming(currentChannelIndex.get() - 1, { duration: DURATION }));
  };

  useAnimatedReaction(
    () => {
      return {
        isKeepUnreadPressedValue: isKeepUnreadPressed.get(),
        isMarkAsReadPressedValue: isMarkAsReadPressed.get(),
      };
    },
    ({ isKeepUnreadPressedValue, isMarkAsReadPressedValue }) => {
      if (index !== Math.round(currentChannelIndex.get())) {
        return;
      }

      if (isKeepUnreadPressedValue) {
        onButtonPressed();
        panX.set(withTiming(-width * 2, { duration: DURATION }));
        runOnJS(handleChannelStatus)("unread");
        runOnJS(resetKeepUnreadPressed)();
      }

      if (isMarkAsReadPressedValue) {
        onButtonPressed();
        panX.set(withTiming(width * 2, { duration: DURATION }));
        runOnJS(handleChannelStatus)("read");
        runOnJS(resetMarkAsReadPressed)();
      }
    }
  );
};
