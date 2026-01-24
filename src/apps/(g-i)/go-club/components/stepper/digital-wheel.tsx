import { FC } from "react";
import { View } from "react-native";
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedReaction,
  withSpring,
} from "react-native-reanimated";
import { AnimatedDigit } from "./animated-digit";
import { ScaleContainer } from "./scale-container";
import { TranslateContainer } from "./translate-container";

const SPRING_CONFIG = {
  mass: 1,
  damping: 14,
  stiffness: 220,
};

const SPRING_CONFIG_FOR_DIGIT_BLUR_AND_OPACITY = {
  mass: 1,
  damping: 14,
  stiffness: 220,
  overshootClamping: true,
};

const FONT_SIZE = 56;

type DigitalWheelProps = {
  currentIndex: SharedValue<number>;
};

export const DigitalWheel: FC<DigitalWheelProps> = ({ currentIndex }) => {
  const animatedIndex = useSharedValue(0);
  const animatedIndexWithOvershootClamping = useSharedValue(0);

  useAnimatedReaction(
    () => currentIndex.get(),
    (value) => {
      animatedIndex.set(withSpring(value, SPRING_CONFIG));
      animatedIndexWithOvershootClamping.set(
        withSpring(value, SPRING_CONFIG_FOR_DIGIT_BLUR_AND_OPACITY),
      );
    },
  );

  return (
    <Animated.View className="w-[30px]" style={{ height: FONT_SIZE }}>
      <TranslateContainer animatedIndex={animatedIndex} fontSize={FONT_SIZE}>
        {Array.from({ length: 10 }, (_, index) => {
          return (
            <View
              key={index}
              className="absolute w-[34px]"
              style={{ top: index * FONT_SIZE, height: FONT_SIZE }}
            >
              <ScaleContainer index={index} animatedIndex={animatedIndexWithOvershootClamping}>
                <AnimatedDigit index={index} animatedIndex={animatedIndexWithOvershootClamping} />
              </ScaleContainer>
            </View>
          );
        })}
      </TranslateContainer>
    </Animated.View>
  );
};
