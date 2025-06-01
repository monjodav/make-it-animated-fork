import { createContext, FC, PropsWithChildren, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { useCatchUpStore } from "../store/catch-up";

// slack-catch-up-cards-swipe-animation 🔽

type ContextValue = {
  isDragging: SharedValue<boolean>;
  // I separated animatedChannelIndex from currentChannelIndex to be able to animate the channel while it's being dragged
  // I need currentChannelIndex without float so it's easier to handle logic based on currentChannelIndex and prevChannelIndex
  animatedChannelIndex: SharedValue<number>;
  currentChannelIndex: SharedValue<number>;
  prevChannelIndex: SharedValue<number>;
  // Because of header and footer are outside of ChannelAnimationContext I decided to handle it here using shared values
  // Animation logic based on isKeepUnreadPressed and isMarkAsReadPressed changes you can find in useHeaderControlsAnimation and useFooterControlsAnimation hooks
  isKeepUnreadPressed: SharedValue<boolean>;
  isMarkAsReadPressed: SharedValue<boolean>;
  // isDone is used to trigger animation when we have no more unread channels
  isDone: SharedValue<boolean>;
  // undoChannelIndex is used to animate the channel back to its original position when we undo the action
  undoChannelIndex: SharedValue<number | null>;
};

const CatchUpAnimationContext = createContext<ContextValue>({} as ContextValue);

export const CatchUpAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const total = useCatchUpStore.use.total();
  const lastItemIndex = total - 1;

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
    <CatchUpAnimationContext.Provider value={value}>{children}</CatchUpAnimationContext.Provider>
  );
};

export const useCatchUpAnimation = () => {
  const context = useContext(CatchUpAnimationContext);

  if (!context) {
    throw new Error("useCatchUpAnimation must be used within an CatchUpAnimationProvider");
  }

  return context;
};

// slack-catch-up-cards-swipe-animation 🔼
