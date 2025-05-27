import { createContext, FC, PropsWithChildren, useContext } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSingleHapticOnPanGesture } from "../hooks/use-single-haptic-on-pan-gesture";

const MIN_VELOCITY = 500;

type ContextValue = {
  panDistance: number;
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
};

const ChannelAnimationContext = createContext<ContextValue>({} as ContextValue);

export const ChannelAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { width } = useWindowDimensions();
  const panDistance = width / 4;

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const { singleHapticOnChange } = useSingleHapticOnPanGesture({
    triggerOffset: panDistance,
    axis: "x",
  });

  const gesture = Gesture.Pan()
    .onStart(() => {
      isDragging.set(true);
    })
    .onChange((event) => {
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
      } else {
        panX.set(withSpring(0, { stiffness: 360, damping: 20 }));
        panY.set(withSpring(0, { stiffness: 360, damping: 20 }));
      }
    });

  const value = { panDistance, panX, panY, isDragging };

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
