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
  const value = useSharedValue<number>(0);

  const progress = useSharedValue(0);

  const onPressHandler = () => {
    const targetValue = progress.get() === 0 ? 1 : 0;
    progress.set(withTiming(targetValue, { duration: 180 }));
  };

  const rSliderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.get(), [0, 1], [0, 1], Extrapolation.CLAMP);
    const scale = withSpring(interpolate(progress.get(), [0, 1], [0.8, 1], Extrapolation.CLAMP), {
      damping: 18,
      stiffness: 450,
      mass: 1,
    });

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const rBlockButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.get(), [0, 1], [1, 0]);
    const scale = withSpring(interpolate(progress.get(), [0, 1], [1, 0.8]), {
      damping: 20,
      stiffness: 300,
      mass: 1,
    });
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View className="gap-4 flex-row">
      <Stepper data={DATA} value={value} onPressHandler={onPressHandler} progress={progress} />
      <Animated.View style={[{ flex: 1 }, rBlockButtonStyle]}>
        <BlockButton />
      </Animated.View>
      <Animated.View className="absolute right-0 self-center" style={[rSliderStyle]}>
        <Slider data={DATA} value={value} />
      </Animated.View>
    </View>
  );
};
