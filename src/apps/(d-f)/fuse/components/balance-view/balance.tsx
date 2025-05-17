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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DURATION = 175;
const EASING = Easing.out(Easing.ease);

const TRANSFORM_BALANCE_SECURE_DEFAULT = [
  { translateY: -35 },
  { translateX: -4 },
  { skewX: "45deg" },
  { rotateX: "90deg" },
  { rotateY: "3deg" },
];

const TRANSFORM_BALANCE_INSECURE_DEFAULT = [
  { translateY: 30 },
  { translateX: 4 },
  { skewX: "45deg" },
  { rotateX: "90deg" },
  { rotateY: "3deg" },
];

const TRANSFORM_ZERO = [
  { translateY: 0 },
  { translateX: 0 },
  { skewX: "0deg" },
  { rotateX: "0deg" },
  { rotateY: "0deg" },
];

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

  const rBalanceSecureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isBalanceSecureTouched.value ? -4 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceSecureTouched.value ? 2 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          scale: withTiming(isBalanceSecureTouched.value ? 0.97 : 1, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          rotateX: withTiming(isBalanceSecureTouched.value ? "5deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          skewX: withTiming(isBalanceSecureTouched.value ? "2deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  const rBalanceInsecureStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isBalanceInsecureTouched.value ? 5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceInsecureTouched.value ? 2.5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          scale: withTiming(isBalanceInsecureTouched.value ? 0.97 : 1, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          rotateX: withTiming(isBalanceInsecureTouched.value ? "5deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          skewX: withTiming(isBalanceInsecureTouched.value ? "2deg" : "0deg", {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  const onLongPressBalanceSecure = () => {
    setIsBalanceSecure(!isBalanceSecure);
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.value === "percent") {
      return;
    }
    setBalanceChangeView("currency");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onLongPressBalanceInsecure = () => {
    setIsBalanceSecure(!isBalanceSecure);
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.value === "percent") {
      return;
    }
    setBalanceChangeView("percent");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

// fuse-balance-insecure-view-toggle-animation 🔼
