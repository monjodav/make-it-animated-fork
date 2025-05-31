import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  SharedValue,
  useSharedValue,
  withDecay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSingleHapticOnPanGesture } from "../hooks/use-single-haptic-on-pan-gesture";
import { useUnreadStore } from "../store/unread";
import { ChannelStatus } from "../types";
import * as Haptics from "expo-haptics";
import { useUnreadAnimation } from "./unread-animation";

type ContextValue = {
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  absoluteYAnchor: SharedValue<number>;
  panDistance: number;
  handleChannelStatus: (status: ChannelStatus) => void;
};

const ChannelAnimationContext = createContext<ContextValue>({} as ContextValue);

export const ChannelAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDragging, animatedChannelIndex, currentChannelIndex, prevChannelIndex, isDone } =
    useUnreadAnimation();

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

  const handleChannelStatus = useCallback((status: ChannelStatus) => {
    if (currentChannelIndex.get() === -1 && prevChannelIndex.get() === 0) {
      isDone.set(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentChannelIndex.get() < prevChannelIndex.get()) {
      const channelIndex = currentChannelIndex.get() + 1;
      console.log("🔴 handleChannelStatus", currentChannelIndex.get() + 1); // VS --------- Remove Log
    } else {
      const channelIndex = currentChannelIndex.get();
      console.log("🔴 handleChannelStatus", currentChannelIndex.get()); // VS --------- Remove Log
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isDragging.set(true);
      absoluteYAnchor.set(event.absoluteY);
    })
    .onChange((event) => {
      const progress = currentChannelIndex.get() - Math.abs(event.translationX) / panDistance;
      animatedChannelIndex.set(
        progress < currentChannelIndex.get() - 1 ? currentChannelIndex.get() - 1 : progress
      );

      panX.set(event.translationX);
      panY.set(event.translationY);
      singleHapticOnChange(event);
    })
    .onEnd((event) => {
      isDragging.set(false);
      if (Math.abs(event.translationX) > panDistance) {
        prevChannelIndex.set(Math.round(currentChannelIndex.get()));
        currentChannelIndex.set(Math.round(currentChannelIndex.get() - 1));

        const status = event.translationX > 0 ? "read" : "unread";
        const sign = event.translationX > 0 ? 1 : -1;

        panX.set(withTiming(sign * width * 2));
        panY.set(
          withSequence(
            withDecay({
              velocity: event.velocityY,
            }),
            withTiming(0, { duration: 0 })
          )
        );

        runOnJS(handleChannelStatus)(status);
      } else {
        // We reset panX and panY to 0 on release
        panX.set(withSpring(0, { stiffness: 360, damping: 20 }));
        panY.set(withSpring(0, { stiffness: 360, damping: 20 }));

        // We need, because on release our index can be a float so we ceil it
        animatedChannelIndex.set(Math.ceil(currentChannelIndex.get()));
      }
    });

  const value = {
    panX,
    panY,
    absoluteYAnchor,
    panDistance,
    handleChannelStatus,
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
