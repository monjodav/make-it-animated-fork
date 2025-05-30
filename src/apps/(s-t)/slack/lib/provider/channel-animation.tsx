import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";
import { useWindowDimensions, InteractionManager } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  SharedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSingleHapticOnPanGesture } from "../hooks/use-single-haptic-on-pan-gesture";
import { useUnreadStore } from "../store/unread";
import { ChannelStatus } from "../types";
import * as Haptics from "expo-haptics";

const MIN_VELOCITY = 500;

type ContextValue = {
  activeChannelIndex: SharedValue<number>;
  panDistance: number;
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  absoluteYAnchor: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  isDone: SharedValue<boolean>;
  handlePopChannel: (status: ChannelStatus) => void;
};

const ChannelAnimationContext = createContext<ContextValue>({} as ContextValue);

type Props = {
  total: number;
};

export const ChannelAnimationProvider: FC<PropsWithChildren<Props>> = ({ children, total }) => {
  const { width } = useWindowDimensions();
  const panDistance = width / 4;

  const lastItemIndex = total - 1;
  const activeChannelIndex = useSharedValue(lastItemIndex);

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const absoluteYAnchor = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isDone = useSharedValue(false);

  const { singleHapticOnChange } = useSingleHapticOnPanGesture({
    triggerOffset: panDistance,
    axis: "x",
  });

  const popChannel = useUnreadStore.use.popChannel();

  const handlePopChannel = useCallback(
    (status: ChannelStatus) => {
      if (total === 1) {
        isDone.set(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      InteractionManager.runAfterInteractions(() => {
        popChannel(status);
        // panX.set(0);
        // panY.set(0);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [total]
  );

  const gesture = Gesture.Pan()
    .onStart((event) => {
      isDragging.set(true);
      absoluteYAnchor.set(event.absoluteY);
    })
    .onChange((event) => {
      const progress = lastItemIndex - Math.abs(event.translationX) / panDistance;
      activeChannelIndex.set(progress < lastItemIndex - 1 ? lastItemIndex - 1 : progress);

      panX.set(event.translationX);
      panY.set(event.translationY);
      singleHapticOnChange(event);
    })
    .onEnd((event) => {
      isDragging.set(false);
      if (Math.abs(event.velocityX) > MIN_VELOCITY || Math.abs(event.translationX) > panDistance) {
        panX.set(withTiming(width * 2 * Math.sign(event.velocityX)));
        panY.set(
          withDecay({
            velocity: event.velocityY,
          })
        );
        const status = event.translationX > 0 ? "read" : "unread";
        runOnJS(handlePopChannel)(status);
      } else {
        panX.set(withSpring(0, { stiffness: 360, damping: 20 }));
        panY.set(withSpring(0, { stiffness: 360, damping: 20 }));
        activeChannelIndex.set(withTiming(lastItemIndex, { duration: 100 }));
      }
    });

  const value = {
    activeChannelIndex,
    panDistance,
    panX,
    panY,
    absoluteYAnchor,
    isDragging,
    isDone,
    handlePopChannel,
  };

  return (
    <ChannelAnimationContext.Provider value={value}>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </ChannelAnimationContext.Provider>
  );
};

export const useChannelAnimation = () => {
  const context = useContext(ChannelAnimationContext);

  if (!context) {
    throw new Error("useChannelAnimation must be used within an ChannelAnimationProvider");
  }

  return context;
};
