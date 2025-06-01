import { useWindowDimensions } from "react-native";
import { useUnreadAnimation } from "../provider/unread-animation";
import { useChannelAnimation } from "../provider/channel-animation";
import { runOnJS, useAnimatedReaction, withTiming } from "react-native-reanimated";

// slack-catch-up-cards-swipe-animation 🔽

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
      // Be sure to set isKeepUnreadPressed before handleChannelStatus call to avoid re-render issue on store update
      isKeepUnreadPressed.set(false);
      isDragging.set(false);
      handleChannelStatus("unread");
    }, TIMEOUT);
  };

  const resetMarkAsReadPressed = () => {
    setTimeout(() => {
      // Be sure to set isMarkAsReadPressed before handleChannelStatus call to avoid re-render issue on store update
      isMarkAsReadPressed.set(false);
      isDragging.set(false);
      handleChannelStatus("read");
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
        runOnJS(resetKeepUnreadPressed)();
      }

      if (isMarkAsReadPressedValue) {
        onButtonPressed();
        panX.set(withTiming(width * 2, { duration: DURATION }));
        runOnJS(resetMarkAsReadPressed)();
      }
    }
  );
};

// slack-catch-up-cards-swipe-animation 🔼
