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
};

const TimeSlider = ({
  sliderWidth,
  sliderHeight,
  dividerCount = 5,
  min = 0,
  max = dividerCount,
  onValueChange,
  valueFormatter,
}: TimeSliderProps) => {
  const SLIDER_WIDTH = sliderWidth;
  const SLIDER_HEIGHT = sliderHeight;
  const DIVIDER_WIDTH = 2;

  const STEPS = Array.from({ length: dividerCount });

  const sliderProgress = useSharedValue(0);
  const isActive = useSharedValue(false);
  const stretchAmount = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isActive.set(true);
    })
    .onUpdate((event) => {
      const progress = event.x / SLIDER_WIDTH;

      if (sliderProgress.get() === 0 && event.x < 0) {
        const stretch = Math.abs(event.x) / 1.7;
        stretchAmount.set(Math.min(stretch, 70));
        sliderProgress.set(0);
      } else {
        stretchAmount.set(0);
        sliderProgress.set(Math.max(0, Math.min(1, progress)));
      }
    })
    .onFinalize(() => {
      isActive.set(false);

      stretchAmount.set(
        withSpring(0, {
          stiffness: 1300,
          damping: 110,
          mass: 6,
        })
      );

      sliderProgress.set(withSpring(sliderProgress.get()));
    });

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

  const rContainerStyle = useAnimatedStyle(() => {
    const scale = withSpring(isActive.get() ? 1.034 : 1);

    const stretchWidth = SLIDER_WIDTH + stretchAmount.get();
    const stretchHeight = SLIDER_HEIGHT - stretchAmount.get() * 0.15;

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
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 25}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFillObject}
        />

        {STEPS.map((_, index) => {
          const rDividerStyle = useAnimatedStyle(() => {
            const currentWidth = SLIDER_WIDTH + stretchAmount.get();
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
