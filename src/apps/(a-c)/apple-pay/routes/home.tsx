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

// NFC reader circle diameter - matches Apple Pay's visual design system
const CIRCLE_SIZE = 70;

export const Home = () => {
  const insets = useSafeAreaInsets();
  // Shared value drives the entire animation cycle: 0 = phone tilted away, 1 = phone near reader
  const progress = useSharedValue(0);

  useEffect(() => {
    // Infinite loop animation: phone tilts toward reader, then away
    // Sequence: 100ms delay → animate to 1 (1000ms) → 200ms delay → animate to 0 (1000ms) → repeat
    // The 200ms delay creates a brief pause when phone is closest, mimicking real NFC interaction timing
    progress.set(
      withRepeat(
        withSequence(
          withDelay(100, withTiming(1, { duration: 1300, easing: Easing.out(Easing.ease) })),
          withDelay(200, withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }))
        ),
        -1
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3D phone tilt animation: creates depth illusion as phone approaches NFC reader
  const phoneAnimatedStyle = useAnimatedStyle(() => {
    // Perspective: 600→800 increases 3D depth effect as phone gets closer (stronger parallax)
    const perspective = interpolate(progress.get(), [0, 1], [600, 800]);
    // Rotation: 25deg→0deg tilts phone from angled position to flat (mimics user bringing phone closer)
    const rotation = interpolate(progress.get(), [0, 1], [25, 0]);
    // Scale: 0.96→1 creates subtle zoom-in effect as phone approaches reader
    const scale = interpolate(progress.get(), [0, 1], [0.96, 1]);

    return {
      // Transform origin at bottom ensures phone rotates from its base (realistic pivot point)
      transformOrigin: "bottom",
      transform: [{ perspective }, { rotateX: `${rotation}deg` }, { scale }],
    };
  });

  // Shadow follows phone movement: translates down as phone tilts forward
  const phoneShadowAnimatedStyle = useAnimatedStyle(() => ({
    transformOrigin: "center",
    transform: [
      {
        // 30deg rotation matches phone's initial tilt angle for realistic shadow casting
        rotate: "30deg",
      },
      {
        // Shadow moves down (translateY) as phone tilts forward: 0→59.5px (CIRCLE_SIZE * 0.85)
        // The 0.85 multiplier creates natural shadow offset distance
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
        {/* NFC reader circle: blue border represents Apple Pay's contactless payment indicator */}
        <View
          className="border-4 border-blue-500 items-center justify-end rounded-full overflow-hidden"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          {/* Phone container: positioned at 25% from top, 56% width matches phone aspect ratio */}
          <Animated.View
            className="absolute top-[25%] h-full w-[56%]"
            // 300ms delay staggers phone entrance after NFC circle appears (creates layered reveal)
            entering={FadeInDown.springify().delay(300)}
          >
            {/* Phone representation: blue gradient (#08457E) with border, animated 3D transforms */}
            <Animated.View
              className="flex-1 rounded-lg bg-[#08457E] border-2 border-blue-500 overflow-hidden"
              style={phoneAnimatedStyle}
            >
              {/* Shadow: oversized (200% x 200%) and offset (-50%, -30%) to create natural drop shadow effect */}
              <Animated.View
                className="absolute -left-[50%] -top-[30%] w-[200%] h-[200%] bg-[#003153]"
                style={phoneShadowAnimatedStyle}
              />
              {/* Phone notch indicator: subtle detail at top center */}
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
