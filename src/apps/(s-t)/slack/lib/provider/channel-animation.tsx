import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";
import { useWindowDimensions, InteractionManager } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  SharedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSingleHapticOnPanGesture } from "../hooks/use-single-haptic-on-pan-gesture";
import { useUnreadStore } from "../store/unread";
import { ChannelStatus } from "../types";
import * as Haptics from "expo-haptics";
import { useUnreadAnimation } from "./unread-animation";

const MIN_VELOCITY = 500;

type ContextValue = {
  panDistance: number;
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  absoluteYAnchor: SharedValue<number>;
  handlePopChannel: (status: ChannelStatus) => void;
};

const ChannelAnimationContext = createContext<ContextValue>({} as ContextValue);

export const ChannelAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentChannelIndex, prevChannelIndex, isDragging, isDone } = useUnreadAnimation();

  const { width } = useWindowDimensions();
  const panDistance = width / 4;

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const absoluteYAnchor = useSharedValue(0);

  const { singleHapticOnChange } = useSingleHapticOnPanGesture({
    triggerOffset: panDistance,
    axis: "x",
  });

  const popChannel = useUnreadStore.use.popChannel();

  const handlePopChannel = useCallback((status: ChannelStatus) => {
    if (prevChannelIndex.get() === 0) {
      isDone.set(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    prevChannelIndex.set(Math.round(currentChannelIndex.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isDragging.set(true);
      absoluteYAnchor.set(event.absoluteY);
      prevChannelIndex.set(Math.round(currentChannelIndex.get()));
    })
    .onChange((event) => {
      const progress = prevChannelIndex.value - Math.abs(event.translationX) / panDistance;
      currentChannelIndex.set(
        progress < prevChannelIndex.value - 1 ? prevChannelIndex.value - 1 : progress
      );

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
        currentChannelIndex.set(withTiming(prevChannelIndex.value, { duration: 100 }));
      }
    });

  const value = {
    panDistance,
    panX,
    panY,
    absoluteYAnchor,
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
