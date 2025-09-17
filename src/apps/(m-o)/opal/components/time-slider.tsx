import React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

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
  const isActive = useSharedValue(false);
  const stretchAmount = useSharedValue(0);

  const startProgress = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      isActive.value = true;
      const localX = event.x;
      const initialProgress = Math.max(0, Math.min(1, localX / SLIDER_WIDTH));
      sliderProgress.value = initialProgress;
      startProgress.value = sliderProgress.value;
    })
    .onUpdate((event) => {
      const delta = event.translationX / SLIDER_WIDTH;
      let next = startProgress.value + delta;
      if (next < 0) {
        const overflow = Math.abs(next) * SLIDER_WIDTH;
        const stretch = overflow / 1.7;
        stretchAmount.value = Math.min(stretch, 70);
        next = 0;
      } else {
        stretchAmount.value = 0;
      }
      sliderProgress.value = Math.max(0, Math.min(1, next));
    })
    .onEnd(() => {
      isActive.value = false;
      stretchAmount.value = withSpring(0, {
        stiffness: 1300,
        damping: 110,
        mass: 6,
      });
      sliderProgress.value = withSpring(sliderProgress.value);
    })
    .onFinalize(() => {
      isActive.value = false;
    });

  const tapGesture = Gesture.Tap()
    .enabled(enableTap)
    .hitSlop({ left: 10, right: 10, top: 10, bottom: 10 })
    .onBegin((e) => {
      isActive.value = true;
      const p = Math.max(0, Math.min(1, e.x / SLIDER_WIDTH));
      sliderProgress.value = p;
    })
    .onEnd((e, success) => {
      if (success) {
        const progress = Math.max(0, Math.min(1, e.x / SLIDER_WIDTH));
        sliderProgress.value = withSpring(progress, { stiffness: 900, damping: 120 });
      }
      isActive.value = false;
      stretchAmount.value = withSpring(0);
    });

  const composedGesture = enableTap ? Gesture.Race(tapGesture, panGesture) : panGesture;

  useAnimatedReaction(
    () => sliderProgress.value,
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
    const currentSliderWidth = SLIDER_WIDTH + stretchAmount.value;

    const minFillWidth = currentSliderWidth * 0.03;
    const maxFillWidth = currentSliderWidth * 1;

    const fillWidth = interpolate(
      sliderProgress.value,
      [0, 1],
      [minFillWidth, maxFillWidth],
      Extrapolation.CLAMP
    );

    return {
      width: fillWidth,
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const scale = withSpring(isActive.value ? 1.034 : 1);

    const stretchWidth = SLIDER_WIDTH + stretchAmount.value;
    const stretchHeight = SLIDER_HEIGHT - stretchAmount.value * 0.15;

    return {
      width: stretchWidth,
      height: SLIDER_HEIGHT,
      transform: [{ scale }, { scaleY: stretchHeight / SLIDER_HEIGHT }],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.sliderContainer,
          { borderRadius: SLIDER_HEIGHT / 3, width: SLIDER_WIDTH },
          rContainerStyle,
        ]}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 25}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFillObject}
        />

        {STEPS.map((_, index) => {
          const rDividerStyle = useAnimatedStyle(() => {
            const currentWidth = SLIDER_WIDTH + stretchAmount.value;
            const segments = dividerCount + 1;
            const part = currentWidth / segments;
            return { left: part * (index + 1) - DIVIDER_WIDTH / 2 };
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.divider,
                {
                  height: index % 2 !== 0 ? SLIDER_HEIGHT * 0.47 : SLIDER_HEIGHT * 0.3,
                  backgroundColor: index % 2 === 0 ? "#454545ff" : "#636164",
                },
                rDividerStyle,
              ]}
            />
          );
        })}

        <Animated.View style={[styles.fill, rFillStyle]} />
      </Animated.View>
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
