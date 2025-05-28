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
  absoluteYAnchor: SharedValue<number>;
  isDragging: SharedValue<boolean>;
};

const ChannelAnimationContext = createContext<ContextValue>({} as ContextValue);

type Props = {
  index: number;
  activeChannelIndex: SharedValue<number>;
  total: number;
};

export const ChannelAnimationProvider: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  activeChannelIndex,
  total,
}) => {
  const { width } = useWindowDimensions();
  const panDistance = width / 4;

  const lastItem = total - 1;

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const absoluteYAnchor = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const { singleHapticOnChange } = useSingleHapticOnPanGesture({
    triggerOffset: panDistance,
    axis: "x",
  });

  const gesture = Gesture.Pan()
    .onStart((event) => {
      isDragging.set(true);
      absoluteYAnchor.set(event.absoluteY);
    })
    .onChange((event) => {
      const progress = index - Math.abs(event.translationX) / panDistance;
      activeChannelIndex.set(progress < lastItem - 1 ? lastItem - 1 : progress);

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

  const value = { panDistance, panX, panY, absoluteYAnchor, isDragging };

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
