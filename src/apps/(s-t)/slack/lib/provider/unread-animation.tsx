import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useUnreadStore } from "../store/unread";

type ContextValue = {
  currentChannelIndex: SharedValue<number>;
  prevChannelIndex: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  isDone: SharedValue<boolean>;
};

const UnreadAnimationContext = createContext<ContextValue>({} as ContextValue);

export const UnreadAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const unreadChannels = useUnreadStore.use.unreadChannels();
  const lastItemIndex = unreadChannels.length - 1;

  const currentChannelIndex = useSharedValue(lastItemIndex);
  const prevChannelIndex = useSharedValue(lastItemIndex);
  const isDragging = useSharedValue(false);

  const isDone = useSharedValue(false);

  const value = { currentChannelIndex, prevChannelIndex, isDone, isDragging };

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
