import { runOnJS, useAnimatedReaction, withSpring, withTiming } from "react-native-reanimated";
import { useChannelAnimation } from "../provider/channel-animation";
import { useUnreadAnimation } from "../provider/unread-animation";

const DURATION = 300;

const ANIM_CONFIG = {
  stiffness: 320,
  damping: 28,
};

export const useHeaderControlsAnimation = (index: number) => {
  const { animatedChannelIndex, currentChannelIndex, prevChannelIndex, undoChannelIndex } =
    useUnreadAnimation();
  const { panX, panY, absoluteYAnchor, handleChannelStatus } = useChannelAnimation();

  const resetUndoPressed = () => {
    setTimeout(() => {
      undoChannelIndex.set(null);
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
        absoluteYAnchor.set(0);

        // Important here to keep an order so currentChannelIndex is last
        prevChannelIndex.set(currentChannelIndex.get());
        animatedChannelIndex.set(withTiming(currentChannelIndex.get() + 1, { duration: DURATION }));
        currentChannelIndex.set(currentChannelIndex.get() + 1);

        panX.set(withSpring(0, ANIM_CONFIG));
        panY.set(withSpring(0, ANIM_CONFIG));

        runOnJS(handleChannelStatus)("unread");
        runOnJS(resetUndoPressed)();
      }
    }
  );
};
