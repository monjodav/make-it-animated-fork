import { useCallback } from "react";
import { Pressable, View } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedReaction } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Minus } from "lucide-react-native";
import { AnimatedDigit } from "../components/stepper/animated-digit";
import { ScaleContainer } from "../components/stepper/scale-container";
import { TranslateContainer } from "../components/stepper/translate-container";

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

export const Stepper = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const fontSize = 56;

  const digitWidth = useSharedValue(0);
  const digitHeight = useSharedValue(0);
  const currentIndex = useSharedValue(0);
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

  const handleIncrement = useCallback(() => {
    currentIndex.set(Math.min(9, Math.floor(currentIndex.get()) + 1));
  }, [currentIndex]);

  const handleDecrement = useCallback(() => {
    currentIndex.set(Math.max(0, Math.ceil(currentIndex.get()) - 1));
  }, [currentIndex]);

  return (
    <View
      className="flex-1 items-center justify-center bg-[#140D8C]"
      style={{ paddingTop: safeAreaInsets.top }}
    >
      <View
        className="absolute top-[384px] left-0 right-0 flex-row items-center justify-between gap-4 px-24 py-3 z-10"
        style={{ paddingTop: safeAreaInsets.top }}
      >
        <Pressable
          onPress={handleDecrement}
          className="size-10 items-center justify-center rounded-full bg-white/20"
        >
          <Minus size={24} color="#ffffff" />
        </Pressable>
        <Pressable
          onPress={handleIncrement}
          className="size-10 items-center justify-center rounded-full bg-white/20"
        >
          <Plus size={24} color="#ffffff" />
        </Pressable>
      </View>
      <Animated.View className="w-[30px]" style={{ height: fontSize }}>
        <TranslateContainer animatedIndex={animatedIndex} fontSize={fontSize}>
          {Array.from({ length: 10 }, (_, index) => {
            return (
              <View
                key={index}
                className="absolute w-[34px]"
                style={{ top: index * fontSize, height: fontSize }}
              >
                <ScaleContainer index={index} animatedIndex={animatedIndexWithOvershootClamping}>
                  <AnimatedDigit
                    index={index}
                    animatedIndex={animatedIndexWithOvershootClamping}
                    digitWidth={digitWidth}
                    digitHeight={digitHeight}
                  />
                </ScaleContainer>
              </View>
            );
          })}
        </TranslateContainer>
      </Animated.View>
      {/* <Text
        className="absolute opacity-0 text-white text-5xl font-bold"
        onLayout={(event) => {
          digitWidth.set(event.nativeEvent.layout.width);
          digitHeight.set(event.nativeEvent.layout.height);
        }}
        pointerEvents="none"
      >
        0
      </Text> */}
    </View>
  );
};
