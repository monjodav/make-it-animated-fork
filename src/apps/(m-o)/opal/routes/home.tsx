import React, { FC } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Home: FC = () => {
  const insets = useSafeAreaInsets();

  const SLIDER_WIDTH = 280;
  const SLIDER_HEIGHT = 50;

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
        const stretch = Math.abs(event.x) / 2;
        stretchAmount.value = Math.min(stretch, 60);
        sliderProgress.value = 0;
      } else {
        stretchAmount.value = 0;
        sliderProgress.value = Math.max(0, Math.min(1, progress));
      }
    })
    .onFinalize(() => {
      isActive.value = false;

      stretchAmount.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });

      sliderProgress.value = withSpring(sliderProgress.value);
    });

  const rFillStyle = useAnimatedStyle(() => {
    const currentSliderWidth = SLIDER_WIDTH + stretchAmount.value;

    const minFillWidth = currentSliderWidth * 0.035;
    const maxFillWidth = currentSliderWidth * 1;

    const fillWidth = interpolate(
      sliderProgress.value,
      [0, 1],
      [minFillWidth, maxFillWidth],
      Extrapolation.CLAMP
    );

    return {
      width: fillWidth,
      backgroundColor: isActive.value ? "#3B82F6" : "#1D4ED8",
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const scale = withSpring(isActive.value ? 1.03 : 1);

    const stretchWidth = SLIDER_WIDTH + stretchAmount.value;
    const stretchHeight = SLIDER_HEIGHT - stretchAmount.value * 0.3;

    return {
      width: stretchWidth,
      height: 50,
      transform: [{ scale }, { scaleY: stretchHeight / SLIDER_HEIGHT }],
    };
  });

  return (
    <View className="flex-1 bg-white justify-end" style={{ paddingTop: insets.top }}>
      <View
        className="absolute bottom-20 left-6 bg-gray-300"
        style={{
          height: SLIDER_HEIGHT,
          width: SLIDER_HEIGHT * 1.2,
          borderRadius: 15,
        }}
      />
      <View className="pb-20 ml-auto pr-6">
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                backgroundColor: "#EF4444",
                borderRadius: 15,
                overflow: "hidden",
                position: "relative",
              },
              rContainerStyle,
            ]}
          >
            {/* Blue fill area */}
            <Animated.View
              style={[
                {
                  height: "100%",
                  position: "absolute",
                  left: 0,
                  top: 0,
                },
                rFillStyle,
              ]}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};
