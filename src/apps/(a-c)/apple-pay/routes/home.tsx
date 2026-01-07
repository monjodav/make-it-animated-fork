import { useEffect } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CreditCard } from "../components/credit-card";

// apple-pay-hold-near-reader-animation 🔽

const CIRCLE_SIZE = 70;

export const Home = () => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withRepeat(
        withSequence(
          withDelay(100, withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })),
          withDelay(200, withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }))
        ),
        -1
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phoneAnimatedStyle = useAnimatedStyle(() => {
    const perspective = interpolate(progress.get(), [0, 1], [600, 800]);
    const rotation = interpolate(progress.get(), [0, 1], [25, 0]);
    const scale = interpolate(progress.get(), [0, 1], [0.96, 1]);

    return {
      transformOrigin: "bottom",
      transform: [{ perspective }, { rotateX: `${rotation}deg` }, { scale }],
    };
  });

  const phoneShadowAnimatedStyle = useAnimatedStyle(() => ({
    transformOrigin: "center",
    transform: [
      {
        rotate: "30deg",
      },
      {
        translateY: interpolate(progress.get(), [0, 1], [0, CIRCLE_SIZE * 0.85]),
      },
    ],
  }));

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top + 12 }}>
      {/* Top Credit Card */}
      <View className="px-4">
        <CreditCard bankName="monobank" cardNumber="•••• •••• •••• 4536" currency="UAH" />
      </View>

      {/* Center NFC Reader Animation */}
      <View className="absolute inset-0 items-center justify-center">
        <View
          className="border-4 border-blue-500 items-center justify-end rounded-full overflow-hidden"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          <Animated.View
            className="absolute top-[25%] h-full w-[56%]"
            entering={FadeInDown.springify().delay(300)}
          >
            <Animated.View
              className="flex-1 rounded-lg bg-[#08457E] border-2 border-blue-500 overflow-hidden"
              style={phoneAnimatedStyle}
            >
              <Animated.View
                className="absolute -left-[50%] -top-[30%] w-[200%] h-[200%] bg-[#003153]"
                style={phoneShadowAnimatedStyle}
              />
              <View className="absolute top-1 w-[25%] h-0.5 rounded-full bg-blue-500 self-center" />
            </Animated.View>
          </Animated.View>
        </View>
        <Text className="text-xl text-neutral-400 mt-5">Hold Near Reader</Text>
      </View>

      {/* Bottom Credit Card */}
      <View className="absolute -bottom-[100px] left-0 right-0 px-4">
        <CreditCard bankName="PUMB" cardNumber="•••• •••• •••• 3798" currency="EURO" />
      </View>
    </View>
  );
};

// apple-pay-hold-near-reader-animation 🔼
