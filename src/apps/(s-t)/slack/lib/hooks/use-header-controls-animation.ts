import { runOnJS, useAnimatedReaction, withSpring, withTiming } from "react-native-reanimated";
import { useChannelAnimation } from "../provider/channel-animation";
import { useUnreadAnimation } from "../provider/unread-animation";

// slack-catch-up-cards-swipe-animation 🔽

const DURATION = 300;

const ANIM_CONFIG = {
  stiffness: 320,
  damping: 28,
};

export const useHeaderControlsAnimation = (index: number) => {
  const {
    isDragging,
    animatedChannelIndex,
    currentChannelIndex,
    prevChannelIndex,
    undoChannelIndex,
  } = useUnreadAnimation();
  const { panX, panY, absoluteYAnchor, handleChannelStatus } = useChannelAnimation();

  const resetUndoPressed = () => {
    setTimeout(() => {
      // Be sure to set undoChannelIndex before handleChannelStatus call to avoid re-render issue on store update
      undoChannelIndex.set(null);
      handleChannelStatus("unread");
    }, 250);
  };

  useAnimatedReaction(
    () => {
      return {
        undoChannelIndexValue: undoChannelIndex.get(),
      };
    },
    ({ undoChannelIndexValue }) => {
      if (index !== undoChannelIndex.get()) {
        return;
      }

      if (undoChannelIndexValue !== null) {
        isDragging.set(false);
        absoluteYAnchor.set(0);

        // Important here to keep an order so currentChannelIndex is last
        prevChannelIndex.set(currentChannelIndex.get());
        animatedChannelIndex.set(withTiming(currentChannelIndex.get() + 1, { duration: DURATION }));
        currentChannelIndex.set(currentChannelIndex.get() + 1);

        panX.set(withSpring(0, ANIM_CONFIG));
        panY.set(withSpring(0, ANIM_CONFIG));

        runOnJS(resetUndoPressed)();
      }
    }
  );
};

// slack-catch-up-cards-swipe-animation 🔼
