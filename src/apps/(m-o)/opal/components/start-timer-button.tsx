import { View, Text, StyleSheet, Platform, Dimensions, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { BlurView } from "expo-blur";
import {
  Blur,
  Canvas,
  Path,
  processTransform3d,
  Skia,
  usePathValue,
} from "@shopify/react-native-skia";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colorKit } from "reanimated-color-picker";

// opal-start-timer-button-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BUTTON_WIDTH = Dimensions.get("window").width - 24;
const BUTTON_HEIGHT = 56;

const OVAL_BREATHE_DURATION = 4000;
const OVAL_PRIMARY_COLOR = "#04cea9ff";
const OVAL_SECONDARY_COLOR = "#5c8e5bff";

const SHIMMER_DELAY = 4000;
const SHIMMER_BASE_DURATION = 750;
const SHIMMER_REFERENCE_WIDTH = 200;
const SHIMMER_OVERSHOOT = 1.2;

const StartTimerButton = () => {
  const ovalWidth = BUTTON_HEIGHT * 3.4;
  const ovalHeight = BUTTON_HEIGHT * 1.7;
  const centerY = BUTTON_HEIGHT / 1.5 + ovalHeight / 2.2;

  const leftOvalRect = {
    x: ovalWidth / 13,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const leftOvalPathBase = Skia.Path.Make().addOval(leftOvalRect);

  const breathingProgress = useSharedValue(0);

  const scaleLeft = useDerivedValue(() => {
    return interpolate(breathingProgress.get(), [0, 1], [1, 1.2]);
  });

  const colorProgressLeft = useDerivedValue(() => {
    return breathingProgress.get();
  });

  const leftOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleLeft.get() }]));
  }, leftOvalPathBase);

  const rightOvalRect = {
    x: BUTTON_WIDTH - 1.2 * ovalWidth,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const rightOvalPathBase = Skia.Path.Make().addOval(rightOvalRect);

  const scaleRight = useDerivedValue(() => {
    const opposite = 1 - breathingProgress.get();
    return interpolate(opposite, [0, 1], [1, 1.2]);
  });

  const colorProgressRight = useDerivedValue(() => {
    return 1 - breathingProgress.get();
  });

  const rightOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleRight.get() }]));
  }, rightOvalPathBase);

  useEffect(() => {
    breathingProgress.set(withRepeat(withTiming(1, { duration: OVAL_BREATHE_DURATION }), -1, true));
  }, [breathingProgress]);

  const leftOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressLeft.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR]
    );
  });

  const rightOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressRight.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR]
    );
  });

  const shimmerComponentWidth = useSharedValue(0);

  const shimmerProgress = useSharedValue(0);

  const rShimmerStyle = useAnimatedStyle(() => {
    if (shimmerComponentWidth.get() === 0) {
      return {
        opacity: 0,
      };
    }

    const translateX = interpolate(
      shimmerProgress.get(),
      [0, 1],
      [-shimmerComponentWidth.get() * SHIMMER_OVERSHOOT, BUTTON_WIDTH * SHIMMER_OVERSHOOT]
    );
    const opacity = interpolate(shimmerProgress.get(), [0, 0.2, 1], [0.1, 0.05, 0.025]);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  useEffect(() => {
    const duration = Math.max(
      SHIMMER_BASE_DURATION * (BUTTON_WIDTH / SHIMMER_REFERENCE_WIDTH),
      SHIMMER_BASE_DURATION
    );
    shimmerProgress.set(
      withRepeat(
        withSequence(
          withDelay(SHIMMER_DELAY, withTiming(0, { duration: 0 })),
          withTiming(1, { duration: duration, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [shimmerProgress]);

  return (
    <AnimatedPressable
      entering={FadeInDown}
      onPress={simulatePress}
      className="border-neutral-600 h-[56px] rounded-full mx-3 mb-4 overflow-hidden"
      style={styles.container}
    >
      {/* Breathing shapes */}
      {Platform.OS === "ios" && (
        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
      )}
      <Canvas style={styles.canvas}>
        <Path path={leftOvalPath} color={leftOvalColor}>
          <Blur blur={35} />
        </Path>
        <Path path={rightOvalPath} color={rightOvalColor}>
          <Blur blur={35} />
        </Path>
      </Canvas>
      <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-1.5 items-center justify-center">
        <Ionicons name="play" size={20} color="white" />
        <Text className="text-white text-xl font-medium">Start Timer</Text>
      </View>
      {/* Shimmer */}
      <Animated.View
        className="absolute left-0 top-0 bottom-0 w-[100px] flex-row"
        style={rShimmerStyle}
        onLayout={(e) => shimmerComponentWidth.set(e.nativeEvent.layout.width)}
      >
        <LinearGradient
          colors={[colorKit.setAlpha("#fff", 0).hex(), "#fff", colorKit.setAlpha("#fff", 0).hex()]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
  canvas: {
    flex: 1,
    borderRadius: 999,
  },
});

export default StartTimerButton;

// opal-start-timer-button-animation 🔼
