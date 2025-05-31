import { createContext, FC, PropsWithChildren, useContext } from "react";
import { runOnJS, SharedValue, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { useUnreadStore } from "../store/unread";

type ContextValue = {
  isDragging: SharedValue<boolean>;
  currentChannelIndex: SharedValue<number>;
  prevChannelIndex: SharedValue<number>;
  isDecreasing: SharedValue<boolean>;
  isIncreasing: SharedValue<boolean>;
  isKeepUnreadPressed: SharedValue<boolean>;
  isMarkAsReadPressed: SharedValue<boolean>;
  isUndoPressed: SharedValue<boolean>;
  isDone: SharedValue<boolean>;
};

const UnreadAnimationContext = createContext<ContextValue>({} as ContextValue);

export const UnreadAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const unreadChannels = useUnreadStore.use.unreadChannels();
  const lastItemIndex = unreadChannels.length - 1;

  const isDragging = useSharedValue(false);
  const currentChannelIndex = useSharedValue(lastItemIndex);
  const prevChannelIndex = useSharedValue(lastItemIndex);
  const isDecreasing = useSharedValue(false);
  const isIncreasing = useSharedValue(false);
  const isKeepUnreadPressed = useSharedValue(false);
  const isMarkAsReadPressed = useSharedValue(false);
  const isUndoPressed = useSharedValue(false);
  const isDone = useSharedValue(false);

  const resetDecreasing = () => {
    setTimeout(() => {
      isDecreasing.set(false);
    }, 200);
  };

  const resetIncreasing = () => {
    setTimeout(() => {
      isIncreasing.set(false);
    }, 200);
  };

  useAnimatedReaction(
    () => {
      return {
        isDecreasingValue: isDecreasing.get(),
        isIncreasingValue: isIncreasing.get(),
      };
    },
    ({ isDecreasingValue, isIncreasingValue }) => {
      if (isDecreasingValue) {
        runOnJS(resetDecreasing)();
      }
      if (isIncreasingValue) {
        runOnJS(resetIncreasing)();
      }
    }
  );

  const value = {
    isDragging,
    currentChannelIndex,
    prevChannelIndex,
    isDecreasing,
    isIncreasing,
    isKeepUnreadPressed,
    isMarkAsReadPressed,
    isUndoPressed,
    isDone,
  };

  return (
    <UnreadAnimationContext.Provider value={value}>{children}</UnreadAnimationContext.Provider>
  );
};

export const useUnreadAnimation = () => {
  const context = useContext(UnreadAnimationContext);

  if (!context) {
    throw new Error("useUnreadAnimation must be used within an UnreadAnimationProvider");
  }

  return context;
};
