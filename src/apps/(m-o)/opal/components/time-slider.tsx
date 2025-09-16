import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

const TimeSlider = ({
  sliderWidth,
  sliderHeight,
  step,
}: {
  sliderWidth: number;
  sliderHeight: number;
  step: number;
}) => {
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
          {
            borderWidth: 1,
            borderColor: "#636164",
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 15,
            overflow: "hidden",
            position: "relative",
          },
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
                {
                  position: "absolute",
                  height: index % 2 !== 0 ? SLIDER_HEIGHT * 0.5 : SLIDER_HEIGHT * 0.33,
                  width: DIVIDER_WIDTH,
                  backgroundColor: index % 2 === 0 ? "#6f6e6e" : "#636164",
                },
                rDividerStyle,
              ]}
            />
          );
        })}
        <Animated.View
          style={[
            {
              height: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              backgroundColor: "#FFFFFF",
            },
            rFillStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default TimeSlider;
