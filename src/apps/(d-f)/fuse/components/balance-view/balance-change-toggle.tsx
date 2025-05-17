import { ArrowUpRight } from "lucide-react-native";
import React, { FC } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  LONG_PRESS_DELAY,
  useBalanceAnimation,
} from "../../lib/providers/balance-animation-provider";

// fuse-balance-secure-view-toggle-animation 🔽
// fuse-balance-change-toggle-animation 🔽

const DURATION = 250;
const EASING = Easing.out(Easing.ease);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BalanceChangeToggle: FC = () => {
  const {
    isBalanceSecure,
    balanceChangeView,
    setBalanceChangeView,
    balanceChangeTappedValue,
    isBalanceSecureTouched,
    isBalanceInsecureTouched,
  } = useBalanceAnimation();

  const scale = useSharedValue(1);

  const handlePress = () => {
    if (isBalanceSecure && balanceChangeView === "percent") {
      return;
    }
    balanceChangeTappedValue.set(balanceChangeView === "percent" ? "currency" : "percent");
    setBalanceChangeView(balanceChangeView === "percent" ? "currency" : "percent");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  const rPercentContainerStyle = useAnimatedStyle(() => {
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.value === "percent") {
      return {
        transform: [
          {
            translateY: 0,
          },
          {
            translateX: 0,
          },
        ],
      };
    }

    return {
      transform: [
        {
          translateY: withTiming(isBalanceSecureTouched.value ? -2 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceSecureTouched.value ? 0.5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  const rCurrencyContainerStyle = useAnimatedStyle(() => {
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.value === "percent") {
      return {
        transform: [
          {
            translateY: 0,
          },
          {
            translateX: 0,
          },
        ],
      };
    }
    return {
      transform: [
        {
          translateY: withTiming(isBalanceInsecureTouched.value ? 2 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceInsecureTouched.value ? -0.5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      layout={LinearTransition.duration(DURATION)}
      style={rContainerStyle}
      className="flex-row items-center gap-0.5 px-1.5 py-1 border border-neutral-300 rounded-[10px] overflow-hidden"
      onPressIn={() => scale.set(0.95)}
      onPressOut={() => scale.set(1)}
      onPress={handlePress}
    >
      <ArrowUpRight size={14} color="#22c55e" strokeWidth={2.5} />
      {/* NOTE: If you want proper entering and exiting animations in conditional scenario like below don't forget to use unique key prop */}
      {balanceChangeView === "percent" ? (
        <Animated.View key="percent-container" style={rPercentContainerStyle}>
          <Animated.Text
            key="percent-text"
            entering={FadeInUp.duration(DURATION)}
            exiting={FadeOutUp.duration(DURATION)}
            onLayout={() => isBalanceSecureTouched.set(false)}
            className="text-green-500 text-sm font-semibold"
          >
            0.00%
          </Animated.Text>
        </Animated.View>
      ) : (
        <Animated.View key="currency-container" style={rCurrencyContainerStyle}>
          <Animated.Text
            key="currency-text"
            entering={FadeInDown.duration(DURATION)}
            exiting={FadeOutDown.duration(DURATION)}
            onLayout={() => isBalanceInsecureTouched.set(false)}
            className="text-green-500 text-sm font-semibold"
          >
            $0.00
          </Animated.Text>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

// fuse-balance-change-toggle-animation 🔼
// fuse-balance-secure-view-toggle-animation 🔼
