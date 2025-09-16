import React from "react";
import { StyleSheet, View } from "react-native";
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
  step: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number, progress: number) => void;
};

const TimeSlider = ({
  sliderWidth,
  sliderHeight,
  step,
  min = 0,
  max = step - 1,
  onValueChange,
}: TimeSliderProps) => {
  const SLIDER_WIDTH = sliderWidth;
  const SLIDER_HEIGHT = sliderHeight;
  const DIVIDER_WIDTH = 2;

  const STEPS = Array.from({ length: step - 1 });

  const sliderProgress = useSharedValue(0);
  const isActive = useSharedValue(false);
  const stretchAmount = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isActive.value = true;
    })
    .onUpdate((event) => {
      const progress = event.x / SLIDER_WIDTH;

      if (sliderProgress.value === 0 && event.x < 0) {
        const stretch = Math.abs(event.x) / 1.7;
        stretchAmount.value = Math.min(stretch, 70);
        sliderProgress.value = 0;
      } else {
        stretchAmount.value = 0;
        sliderProgress.value = Math.max(0, Math.min(1, progress));
      }
    })
    .onFinalize(() => {
      isActive.value = false;

      stretchAmount.value = withSpring(0, {
        stiffness: 1300,
        damping: 110,
        mass: 8,
      });

      sliderProgress.value = withSpring(sliderProgress.value);
    });

  // Update displayed number when progress changes (avoids re-rendering whole animated tree)
  useAnimatedReaction(
    () => sliderProgress.value,
    (progress) => {
      if (!onValueChange) return;
      const value = Math.round(min + (max - min) * progress);
      runOnJS(onValueChange)(value, progress);
    },
    [min, max, onValueChange]
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
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.sliderContainer,
          { borderRadius: SLIDER_HEIGHT / 3, width: SLIDER_WIDTH },
          rContainerStyle,
        ]}
      >
        <BlurView intensity={45} tint="default" style={StyleSheet.absoluteFillObject} />
        {STEPS.map((_, index) => {
          const rDividerStyle = useAnimatedStyle(() => {
            const currentWidth = SLIDER_WIDTH + stretchAmount.value;
            const part = currentWidth / step;
            return {
              left: part * (index + 1) - DIVIDER_WIDTH / 2,
            };
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.divider,
                {
                  height: index % 2 !== 0 ? SLIDER_HEIGHT * 0.5 : SLIDER_HEIGHT * 0.33,
                  backgroundColor: index % 2 === 0 ? "#6f6e6e" : "#636164",
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
