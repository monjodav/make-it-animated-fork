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

// Enter/exit timing for label swap; longer than Balance to improve legibility.
const DURATION = 250;
// Gentle out-ease keeps vertical slide from feeling springy.
const EASING = Easing.out(Easing.ease);

// Animated wrapper over Pressable to run scale/transform on UI thread.
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
    // Guard: when balance is secure and already showing percent, ignore taps.
    // Mirrors Fuse behavior to avoid redundant state toggles/animations.
    if (isBalanceSecure && balanceChangeView === "percent") {
      return;
    }
    balanceChangeTappedValue.set(balanceChangeView === "percent" ? "currency" : "percent");
    setBalanceChangeView(balanceChangeView === "percent" ? "currency" : "percent");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      // Press feedback: quick scale to emphasize tap without jank.
      transform: [{ scale: withTiming(scale.get(), { duration: 150 }) }],
    };
  });

  const rPercentContainerStyle = useAnimatedStyle(() => {
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.get() === "percent") {
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
          // Micro shift up/left when the secure (masked) balance is touched.
          // Duration synced to LONG_PRESS_DELAY for cohesive long-press feel.
          translateY: withTiming(isBalanceSecureTouched.get() ? -2 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceSecureTouched.get() ? 0.5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  const rCurrencyContainerStyle = useAnimatedStyle(() => {
    // NOTE: See balance-animation-provider for more info why I use balanceChangeTappedValue here
    if (balanceChangeTappedValue.get() === "percent") {
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
          // Micro shift down/right when insecure (visible) balance is touched.
          translateY: withTiming(isBalanceInsecureTouched.get() ? 2 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
        {
          translateX: withTiming(isBalanceInsecureTouched.get() ? -0.5 : 0, {
            duration: LONG_PRESS_DELAY,
            easing: EASING,
          }),
        },
      ],
    };
  });

  return (
    <AnimatedPressable
      // Layout animation ensures container reflows smoothly when label swaps.
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
            // Percent variant slides up when appearing; pairs with EASING above.
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
            // Currency variant slides down when appearing to mirror the swap direction.
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
