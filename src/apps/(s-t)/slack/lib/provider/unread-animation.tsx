import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useUnreadStore } from "../store/unread";

type ContextValue = {
  isDragging: SharedValue<boolean>;
  animatedChannelIndex: SharedValue<number>;
  currentChannelIndex: SharedValue<number>;
  prevChannelIndex: SharedValue<number>;
  isKeepUnreadPressed: SharedValue<boolean>;
  isMarkAsReadPressed: SharedValue<boolean>;
  isDone: SharedValue<boolean>;
  undoChannelIndex: SharedValue<number | null>;
};

const UnreadAnimationContext = createContext<ContextValue>({} as ContextValue);

export const UnreadAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const unreadChannels = useUnreadStore.use.unreadChannels();
  const lastItemIndex = unreadChannels.length - 1;

  const isDragging = useSharedValue(false);
  const animatedChannelIndex = useSharedValue(lastItemIndex);
  const currentChannelIndex = useSharedValue(lastItemIndex);
  const prevChannelIndex = useSharedValue(lastItemIndex);
  const isKeepUnreadPressed = useSharedValue(false);
  const isMarkAsReadPressed = useSharedValue(false);
  const isDone = useSharedValue(false);
  const undoChannelIndex = useSharedValue<number | null>(null);

  const value = {
    isDragging,
    animatedChannelIndex,
    currentChannelIndex,
    prevChannelIndex,
    isKeepUnreadPressed,
    isMarkAsReadPressed,
    undoChannelIndex,
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
