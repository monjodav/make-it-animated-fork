import { createContext, FC, PropsWithChildren, useContext } from "react";
import { runOnJS, SharedValue, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { useUnreadStore } from "../store/unread";

type ContextValue = {
  currentChannelIndex: SharedValue<number>;
  prevChannelIndex: SharedValue<number>;
  isDecreasing: SharedValue<boolean>;
  isDone: SharedValue<boolean>;
  isKeepUnreadPressed: SharedValue<boolean>;
  isMarkAsReadPressed: SharedValue<boolean>;
};

const UnreadAnimationContext = createContext<ContextValue>({} as ContextValue);

export const UnreadAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const unreadChannels = useUnreadStore.use.unreadChannels();
  const lastItemIndex = unreadChannels.length - 1;

  const currentChannelIndex = useSharedValue(lastItemIndex);
  const prevChannelIndex = useSharedValue(lastItemIndex);
  const isDecreasing = useSharedValue(false);
  const isDone = useSharedValue(false);

  const isKeepUnreadPressed = useSharedValue(false);
  const isMarkAsReadPressed = useSharedValue(false);

  const resetDecreasing = () => {
    setTimeout(() => {
      isDecreasing.set(false);
    }, 200);
  };

  useAnimatedReaction(
    () => {
      return {
        isDecreasingValue: isDecreasing.value,
      };
    },
    ({ isDecreasingValue }) => {
      if (isDecreasingValue) {
        runOnJS(resetDecreasing)();
      }
    }
  );

  const value = {
    currentChannelIndex,
    prevChannelIndex,
    isDecreasing,
    isDone,
    isKeepUnreadPressed,
    isMarkAsReadPressed,
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
