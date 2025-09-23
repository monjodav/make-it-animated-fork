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
import { memo, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colorKit } from "reanimated-color-picker";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

// opal-start-timer-button-animation 🔽

// Animated.createAnimatedComponent wraps native Pressable so Reanimated can drive
// entering transitions and animated styles on this host view.
// Ref: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Button geometry
// - BUTTON_WIDTH: full-width minus horizontal margins
// - BUTTON_HEIGHT: fixed height used as base unit for all internal shape math
const BUTTON_WIDTH = Dimensions.get("window").width - 24;
const BUTTON_HEIGHT = 56;

// "Breathing" ovals constants
// - OVAL_BREATHE_DURATION: ping-pong timing (ms) so left/right ovals alternate calmly
// - PRIMARY/SECONDARY: endpoints for color interpolation to create subtle hue shift
const OVAL_BREATHE_DURATION = 4000;
const OVAL_PRIMARY_COLOR = "#04cea9ff";
const OVAL_SECONDARY_COLOR = "#5c8e5bff";

// Shimmer constants
// - SHIMMER_DELAY: initial pause so shimmer doesn't compete with first CTA impression
// - SHIMMER_BASE_DURATION: base sweep speed; scaled by width for consistent perceived velocity
// - SHIMMER_REFERENCE_WIDTH: width used to compute responsive duration multiplier
// - SHIMMER_OVERSHOOT: 1.2 makes the sweep start/end offscreen to avoid visible pop-in/out
const SHIMMER_DELAY = 4000;
const SHIMMER_BASE_DURATION = 750;
const SHIMMER_REFERENCE_WIDTH = 200;
const SHIMMER_OVERSHOOT = 1.2;

const StartTimerButton = () => {
  // Oval layout derived from button height to keep proportions across devices
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

  // Shared driver for breathing animation (0→1 ping-pong)
  const breathingProgress = useSharedValue(0);

  // Left oval scales up as progress goes 0→1 (1.0→1.2)
  // Visually: subtle expansion to imply "inhale"
  const scaleLeft = useDerivedValue(() => {
    return interpolate(breathingProgress.get(), [0, 1], [1, 1.2]);
  });

  // Color interpolation uses the same progress for left oval
  const colorProgressLeft = useDerivedValue(() => {
    return breathingProgress.get();
  });

  // Apply Skia transform on UI thread; cheaper than re-creating paths every frame
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

  // Right oval mirrors left: it expands when left contracts and vice versa
  const scaleRight = useDerivedValue(() => {
    const opposite = 1 - breathingProgress.get();
    return interpolate(opposite, [0, 1], [1, 1.2]);
  });

  // Inverse color phase to reinforce alternating effect
  const colorProgressRight = useDerivedValue(() => {
    return 1 - breathingProgress.get();
  });

  // Skia transform for right oval
  const rightOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleRight.get() }]));
  }, rightOvalPathBase);

  // Start ping-pong breathing: withRepeat + reverse = yo-yo
  useEffect(() => {
    breathingProgress.set(withRepeat(withTiming(1, { duration: OVAL_BREATHE_DURATION }), -1, true));
  }, [breathingProgress]);

  // Left color: progress 0→1 maps PRIMARY→SECONDARY (CLAMP implied)
  const leftOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressLeft.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR]
    );
  });

  // Right color: inverted progress for alternating hue shift
  const rightOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressRight.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR]
    );
  });

  // Measured width of shimmer sub-tree, used to compute offscreen start position
  const shimmerComponentWidth = useSharedValue(0);

  // 0→1 loop for shimmer sweep
  const shimmerProgress = useSharedValue(0);

  // Press feedback: animate scale directly (1 → 0.96 on press-in, back to 1 on release)
  const pressScale = useSharedValue(1);
  const rPressStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: pressScale.get() }] };
  });

  // Shimmer style: translate across button, fade towards edges
  // - opacity: [0, 0.2, 1] → [0.1, 0.05, 0.025] creates bright center and softer tails
  // - translateX: overshoots both sides to hide spawn/despawn
  const rShimmerStyle = useAnimatedStyle(() => {
    if (shimmerComponentWidth.get() === 0) {
      // Hide until layout measured to prevent FOUC of shimmer
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

  // Start shimmer loop with initial delay; duration scales with button width for consistent feel
  useEffect(() => {
    const duration = Math.max(
      SHIMMER_BASE_DURATION * (BUTTON_WIDTH / SHIMMER_REFERENCE_WIDTH),
      SHIMMER_BASE_DURATION
    );
    shimmerProgress.set(
      withRepeat(
        withSequence(
          // Delay the first pass to let breathing settle
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
      // Entering motion: subtle drop-in reinforces prominence without stealing focus
      entering={FadeInDown}
      onPressIn={() => {
        // Light haptic to reinforce intent at the moment of press
        impactAsync(ImpactFeedbackStyle.Light).catch(() => {});
        pressScale.set(withTiming(0.96, { duration: 150, easing: Easing.out(Easing.quad) }));
      }}
      onPressOut={() => {
        pressScale.set(withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }));
      }}
      className="self-center border-neutral-600 rounded-full mb-4 overflow-hidden"
      style={[styles.container, rPressStyle]}
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
        // Capture measured width to compute initial offscreen start
        onLayout={(e) => shimmerComponentWidth.set(e.nativeEvent.layout.width)}
      >
        <LinearGradient
          // Three-stop gradient: transparent → white → transparent to simulate light sweep
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
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
  canvas: {
    flex: 1,
    borderRadius: 999,
  },
});

export default memo(StartTimerButton);

// opal-start-timer-button-animation 🔼
