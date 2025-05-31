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
    animatedChannelIndex,
    currentChannelIndex,
    prevChannelIndex,
    isKeepUnreadPressed,
    isMarkAsReadPressed,
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
    absoluteYAnchor.set(0);

    // Important here to keep an order so currentChannelIndex is last
    prevChannelIndex.set(currentChannelIndex.get());
    animatedChannelIndex.set(withTiming(currentChannelIndex.get() - 1, { duration: DURATION }));
    currentChannelIndex.set(currentChannelIndex.get() - 1);
  };

  useAnimatedReaction(
    () => {
      return {
        isKeepUnreadPressedValue: isKeepUnreadPressed.get(),
        isMarkAsReadPressedValue: isMarkAsReadPressed.get(),
      };
    },
    ({ isKeepUnreadPressedValue, isMarkAsReadPressedValue }) => {
      if (index !== currentChannelIndex.get()) {
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
