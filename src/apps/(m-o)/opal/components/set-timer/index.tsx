import { FC } from "react";
import { View } from "react-native";
import { Stepper } from "./stepper";
import { TimerStep } from "../../lib/types";
import { Slider } from "./slider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import BlockButton from "./block-button";

const SPRING_CONFIG = {
  damping: 90,
  stiffness: 1200,
};

const MINUTES: TimerStep[] = Array.from({ length: 13 }, (_, index) => ({
  id: index * 5,
  value: index * 5,
}));

const HOURS: TimerStep[] = Array.from({ length: 23 }, (_, index) => ({
  id: (index + 2) * 60,
  value: (index + 2) * 60,
}));

const DATA: TimerStep[] = [...MINUTES, ...HOURS];

export const SetTimer: FC = () => {
  const value = useSharedValue<number>(5);

  const presentationState = useSharedValue(0); // 0: stepper, 1: slider

  const onPressHandler = () => {
    const targetValue = presentationState.get() === 0 ? 1 : 0;
    presentationState.set(withTiming(targetValue, { duration: 180 }));
  };

  const rSliderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(presentationState.get(), [0.8, 1], [0, 1], Extrapolation.CLAMP);
    const scale = withSpring(
      interpolate(presentationState.get(), [0, 1], [0.75, 1], Extrapolation.CLAMP),
      SPRING_CONFIG
    );

    return {
      pointerEvents: opacity === 1 ? "auto" : "none",
      opacity,
      transform: [{ scale }],
    };
  });

  const rBlockButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(presentationState.get(), [0, 1], [1, 0]);
    const scale = withSpring(interpolate(presentationState.get(), [0, 1], [1, 0.8]), SPRING_CONFIG);
    return {
      pointerEvents: opacity === 1 ? "auto" : "none",
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View className="gap-4 flex-row">
      <Stepper
        data={DATA}
        value={value}
        onPressHandler={onPressHandler}
        presentationState={presentationState}
      />
      <Animated.View className="flex-1" style={rBlockButtonStyle}>
        <BlockButton />
      </Animated.View>
      <Animated.View className="absolute right-0 self-center" style={rSliderStyle}>
        <Slider data={DATA} value={value} presentationState={presentationState} />
      </Animated.View>
    </View>
  );
};
