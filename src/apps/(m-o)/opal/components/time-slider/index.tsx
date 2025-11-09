import React, { useMemo, useRef, useState, useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureType } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { RubberContainer } from "../rubber-container";

type TimeSliderProps = {
  sliderWidth: number;
  sliderHeight: number;
  dividerCount?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number, progress: number) => void;
  valueFormatter?: (value: number) => number;
  enableTap?: boolean;
};

const TimeSlider = ({
  sliderWidth,
  sliderHeight,
  dividerCount = 5,
  min = 0,
  max = dividerCount,
  onValueChange,
  valueFormatter,
  enableTap = true,
}: TimeSliderProps) => {
  const SLIDER_WIDTH = sliderWidth;
  const SLIDER_HEIGHT = sliderHeight;
  const DIVIDER_WIDTH = 2;

  const STEPS = Array.from({ length: dividerCount });

  const sliderProgress = useSharedValue(0);
  const startProgress = useSharedValue(0);

  // Create shared values for rubber container
  // These will be controlled by RubberContainer but accessible here
  const stretchAmount = useSharedValue(0);
  const isActive = useSharedValue(false);

  // Get reference to RubberContainer to access its stretch gesture
  const rubberContainerRef = useRef<RubberContainerRef>(null);
  const [stretchGesture, setStretchGesture] = useState<GestureType | null>(null);

  // Get stretch gesture from ref when available
  useEffect(() => {
    if (rubberContainerRef.current?.stretchGesture) {
      setStretchGesture(rubberContainerRef.current.stretchGesture);
    }
  }, []);

  // Create pan gesture for slider progress tracking
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((event) => {
          "worklet";
          isActive.set(true);
          const localX = event.x;
          const initialProgress = Math.max(0, Math.min(1, localX / SLIDER_WIDTH));
          sliderProgress.set(initialProgress);
          startProgress.set(sliderProgress.get());
        })
        .onUpdate((event) => {
          "worklet";
          const delta = event.translationX / SLIDER_WIDTH;
          let next = startProgress.get() + delta;
          // Stretch is handled by RubberContainer, we just clamp progress
          if (next < 0) {
            next = 0;
          }
          sliderProgress.set(Math.max(0, Math.min(1, next)));
        })
        .onEnd(() => {
          "worklet";
          isActive.set(false);
          sliderProgress.set(withSpring(sliderProgress.get()));
        })
        .onFinalize(() => {
          "worklet";
          isActive.set(false);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [SLIDER_WIDTH]
  );

  // Create tap gesture for tap-to-set functionality
  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(enableTap)
        .hitSlop({ left: 10, right: 10, top: 10, bottom: 10 })
        .onBegin((e) => {
          "worklet";
          isActive.set(true);
          const p = Math.max(0, Math.min(1, e.x / SLIDER_WIDTH));
          sliderProgress.set(p);
        })
        .onEnd((e, success) => {
          "worklet";
          if (success) {
            const progress = Math.max(0, Math.min(1, e.x / SLIDER_WIDTH));
            sliderProgress.set(withSpring(progress, { stiffness: 900, damping: 120 }));
          }
          isActive.set(false);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enableTap, SLIDER_WIDTH]
  );

  // Compose tap and pan gestures (race - whichever wins)
  const sliderGesture = useMemo(() => {
    if (enableTap) {
      return Gesture.Race(tapGesture, panGesture);
    }
    return panGesture;
  }, [enableTap, tapGesture, panGesture]);

  // Compose slider gestures with rubber container's stretch gesture
  // The stretch gesture runs simultaneously with slider gestures
  const composedGesture = useMemo(() => {
    if (stretchGesture) {
      return Gesture.Simultaneous(sliderGesture, stretchGesture);
    }
    return sliderGesture;
  }, [sliderGesture, stretchGesture]);

  useAnimatedReaction(
    () => sliderProgress.get(),
    (progress) => {
      if (!onValueChange) return;
      const clamped = Math.min(1, Math.max(0, progress));
      const rawValue = min + clamped * (max - min);
      const snapped = Math.round(rawValue);
      const finalValue = valueFormatter ? valueFormatter(snapped) : snapped;
      runOnJS(onValueChange)(finalValue, clamped);
    },
    [min, max, onValueChange, valueFormatter]
  );

  const rFillStyle = useAnimatedStyle(() => {
    const currentSliderWidth = SLIDER_WIDTH + stretchAmount.get();

    const minFillWidth = currentSliderWidth * 0.03;
    const maxFillWidth = currentSliderWidth * 1;

    const fillWidth = interpolate(
      sliderProgress.get(),
      [0, 1],
      [minFillWidth, maxFillWidth],
      Extrapolation.CLAMP
    );

    return {
      width: fillWidth,
    };
  });

  // Divider component that uses animated style
  const Divider = ({ index }: { index: number }) => {
    const rDividerStyle = useAnimatedStyle(() => {
      const currentWidth = SLIDER_WIDTH + stretchAmount.get();
      const segments = dividerCount + 1;
      const part = currentWidth / segments;
      return { left: part * (index + 1) - DIVIDER_WIDTH / 2 };
    });

    return (
      <Animated.View
        style={[
          styles.divider,
          {
            height: index % 2 !== 0 ? SLIDER_HEIGHT * 0.47 : SLIDER_HEIGHT * 0.3,
            backgroundColor: index % 2 === 0 ? "#454545" : "#636164",
          },
          rDividerStyle,
        ]}
      />
    );
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <RubberContainer width={SLIDER_WIDTH} height={SLIDER_HEIGHT}>
        <View className="flex-1 bg-red-500 rounded-lg" />
        {/* <BlurView
          intensity={Platform.OS === "ios" ? 40 : 25}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFillObject}
        />

        {STEPS.map((_, index) => (
          <Divider key={index} index={index} />
        ))}

        <Animated.View style={[styles.fill, rFillStyle]} /> */}
      </RubberContainer>
    </GestureDetector>
  );
};

export default TimeSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    borderWidth: 1,
    borderColor: "#636164",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  divider: {
    position: "absolute",
    width: 2,
  },
  fill: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#FFFFFF",
  },
});
