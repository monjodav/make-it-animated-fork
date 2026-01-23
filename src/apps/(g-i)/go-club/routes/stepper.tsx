import { useCallback } from "react";
import { Pressable, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReText } from "react-native-redash";
import { Plus, Minus } from "lucide-react-native";
import { AnimatedDigit } from "../components/stepper/animated-digit";

const SPRING_CONFIG = {
  mass: 1,
  damping: 16,
  stiffness: 240,
};

export const Stepper = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const digitWidth = useSharedValue(0);
  const digitHeight = useSharedValue(0);
  const animatedIndex = useSharedValue(0);

  const indexString = useDerivedValue(() => {
    return animatedIndex.get().toString();
  });

  const handleIncrement = useCallback(() => {
    animatedIndex.set((currentValue) => withSpring(Math.min(9, currentValue + 1), SPRING_CONFIG));
  }, [animatedIndex]);

  const handleDecrement = useCallback(() => {
    animatedIndex.set((currentValue) => withSpring(Math.max(0, currentValue - 1), SPRING_CONFIG));
  }, [animatedIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: digitWidth.get() + 4,
      height: digitHeight.get(),
    };
  });

  const allDigitsContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -animatedIndex.get() * digitHeight.get(),
        },
      ],
    };
  });

  const singleDigitContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: digitWidth.get(),
      height: digitHeight.get(),
    };
  });

  return (
    <View
      className="flex-1 items-center justify-center bg-[#140D8C]"
      style={{ paddingTop: safeAreaInsets.top }}
    >
      <View
        className="absolute top-0 left-0 right-0 flex-row items-center justify-center gap-4 px-4 py-3 z-10"
        style={{ paddingTop: safeAreaInsets.top }}
      >
        <Pressable
          onPress={handleDecrement}
          className="size-12 items-center justify-center rounded-full bg-white/20"
        >
          <Minus size={24} color="#ffffff" />
        </Pressable>
        <View className="w-[60px] items-center justify-center px-4 py-2 rounded-lg bg-white/10">
          <ReText
            text={indexString}
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
            }}
          />
        </View>
        <Pressable
          onPress={handleIncrement}
          className="size-12 items-center justify-center rounded-full bg-white/20"
        >
          <Plus size={24} color="#ffffff" />
        </Pressable>
      </View>
      <Animated.View className="border border-red-500" style={animatedStyle}>
        <Animated.View
          className="w-full items-center"
          style={allDigitsContainerAnimatedStyle}
          pointerEvents="none"
        >
          {Array.from({ length: 10 }, (_, index) => (
            <Animated.View
              key={index}
              style={singleDigitContainerAnimatedStyle}
              className="items-center justify-center"
            >
              <AnimatedDigit key={index} index={index} animatedIndex={animatedIndex} />
            </Animated.View>
          ))}
        </Animated.View>
      </Animated.View>
      <Text
        className="absolute opacity-0 text-white text-5xl font-bold"
        onLayout={(event) => {
          digitWidth.set(event.nativeEvent.layout.width);
          digitHeight.set(event.nativeEvent.layout.height);
        }}
        pointerEvents="none"
      >
        0
      </Text>
    </View>
  );
};
