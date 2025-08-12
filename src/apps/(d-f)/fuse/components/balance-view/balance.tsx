import { Asterisk } from "lucide-react-native";
import React, { FC } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Animated, { Easing, Keyframe, useAnimatedStyle, withTiming } from "react-native-reanimated";
import {
  LONG_PRESS_DELAY,
  useBalanceAnimation,
} from "../../lib/providers/balance-animation-provider";
import * as Haptics from "expo-haptics";

// fuse-balance-secure-view-toggle-animation 🔽

// Animated wrapper over Pressable so Reanimated can drive its props/styles on the UI thread.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Enter/exit timing tuned to feel snappy but readable for flip-ish motion.
const DURATION = 175;
// Out-ease prevents overshoot when elements settle from 3D skew/rotation.
const EASING = Easing.out(Easing.ease);

// Off-screen, skewed/rotated start state: creates the "cards slide-and-flip in" illusion.
// Negative Y pulls up and left; small rotations keep motion lively without nausea.
const TRANSFORM_BALANCE_SECURE_DEFAULT = [
  { translateY: -35 },
  { translateX: -4 },
  { skewX: "45deg" },
  { rotateX: "90deg" },
  { rotateY: "3deg" },
];

// Mirror of secure start pose: enters from below/right to accent the toggle contrast.
const TRANSFORM_BALANCE_INSECURE_DEFAULT = [
  { translateY: 30 },
  { translateX: 4 },
  { skewX: "45deg" },
  { rotateX: "90deg" },
  { rotateY: "3deg" },
];

// Rest pose for both: no skew/rotation so content remains crisp when settled.
const TRANSFORM_ZERO = [
  { translateY: 0 },
  { translateX: 0 },
  { skewX: "0deg" },
  { rotateX: "0deg" },
  { rotateY: "0deg" },
];

// Keyframe: secure view fades in while unskewing and unrotating to rest pose.
// Using keyframes keeps the 3D transform atomic and on the UI thread.
const balanceSecureEntering = new Keyframe({
  0: {
    opacity: 0,
    transform: TRANSFORM_BALANCE_SECURE_DEFAULT,
  },
  100: {
    opacity: 1,
    transform: TRANSFORM_ZERO,
    easing: EASING,
  },
});

// Keyframe: reverse the motion for a cohesive out animation.
const balanceSecureExiting = new Keyframe({
  0: {
    opacity: 1,
    transform: TRANSFORM_ZERO,
  },
  100: {
    opacity: 0,
    transform: TRANSFORM_BALANCE_SECURE_DEFAULT,
    easing: EASING,
  },
});

// Insecure enters from its mirrored default so the swap feels like a 2-sided flip.
const balanceInsecureEntering = new Keyframe({
  0: {
    opacity: 0,
    transform: TRANSFORM_BALANCE_INSECURE_DEFAULT,
  },
  100: {
    opacity: 1,
    transform: TRANSFORM_ZERO,
    easing: EASING,
  },
});

// Insecure exits back to its default mirrored pose.
const balanceInsecureExiting = new Keyframe({
  0: {
    opacity: 1,
    transform: TRANSFORM_ZERO,
  },
  100: {
    opacity: 0,
    transform: TRANSFORM_BALANCE_INSECURE_DEFAULT,
    easing: EASING,
  },
});

export const Balance: FC = () => {
  const {
    isBalanceSecure,
    setIsBalanceSecure,
    setBalanceChangeView,
    balanceChangeTappedValue,
    isBalanceSecureTouched,
    isBalanceInsecureTouched,
  } = useBalanceAnimation();

  // Micro press feedback for secure view, synced with LONG_PRESS_DELAY so the
  // long-press gesture and press deformation complete together.
  const rBalanceSecureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isBalanceSecureTouched.get() ? -4 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceSecureTouched.get() ? 2 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          scale: withTiming(isBalanceSecureTouched.get() ? 0.97 : 1, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          rotateX: withTiming(isBalanceSecureTouched.get() ? "5deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          skewX: withTiming(isBalanceSecureTouched.get() ? "2deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  // Same micro feedback for insecure view; uses its own touch shared value to
  // avoid cross-contamination when the conditional layout swaps children.
  const rBalanceInsecureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isBalanceInsecureTouched.get() ? 5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceInsecureTouched.get() ? 2.5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          scale: withTiming(isBalanceInsecureTouched.get() ? 0.97 : 1, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          rotateX: withTiming(isBalanceInsecureTouched.get() ? "5deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          skewX: withTiming(isBalanceInsecureTouched.get() ? "2deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  const onLongPressBalanceSecure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBalanceSecure(!isBalanceSecure);
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.get() === "percent") {
      return;
    }
    setBalanceChangeView("currency");
  };

  const onLongPressBalanceInsecure = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBalanceSecure(!isBalanceSecure);
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.get() === "percent") {
      return;
    }
    setBalanceChangeView("percent");
  };

  return (
    <AnimatedPressable className="h-[70px] justify-center overflow-hidden px-4 -ml-5">
      {/* NOTE: If you want proper entering and exiting animations in conditional scenario like below don't forget to use unique key prop */}
      {isBalanceSecure ? (
        <Animated.View key="balance-secure-container" style={rBalanceSecureStyle}>
          <AnimatedPressable
            key="balance-secure-pressable"
            entering={balanceSecureEntering.duration(DURATION)}
            exiting={balanceSecureExiting.duration(DURATION)}
            onTouchStart={() => {
              isBalanceSecureTouched.set(true);
            }}
            // Reset touch state on layout to avoid a stuck pressed pose after tree switches.
            onLayout={() => isBalanceSecureTouched.set(false)}
            onTouchEnd={() => isBalanceSecureTouched.set(false)}
            onLongPress={onLongPressBalanceSecure}
            delayLongPress={LONG_PRESS_DELAY}
            className="flex-row"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Asterisk
                key={index}
                size={30}
                color="#171717"
                strokeWidth={3}
                // Slight negative gap pulls stars together for a denser mask feel.
                style={styles.asteriskIcon}
              />
            ))}
          </AnimatedPressable>
        </Animated.View>
      ) : (
        <Animated.View key="balance-insecure-container" style={rBalanceInsecureStyle}>
          <AnimatedPressable
            key="balance-insecure-pressable"
            entering={balanceInsecureEntering.duration(DURATION)}
            exiting={balanceInsecureExiting.duration(DURATION)}
            className="flex-row"
            // Same stuck-state guard when swapping from the secure layout.
            onLayout={() => isBalanceInsecureTouched.set(false)}
            onTouchStart={() => {
              isBalanceInsecureTouched.set(true);
            }}
            onTouchEnd={() => isBalanceInsecureTouched.set(false)}
            onLongPress={onLongPressBalanceInsecure}
            delayLongPress={LONG_PRESS_DELAY}
          >
            <Text className="text-neutral-900 text-3xl font-bold">$</Text>
            <Text className="text-neutral-900 text-6xl font-bold">0</Text>
            <Text className="text-neutral-400 text-6xl font-bold">.00</Text>
          </AnimatedPressable>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  asteriskIcon: {
    marginHorizontal: -2,
  },
});

// fuse-balance-secure-view-toggle-animation 🔼
