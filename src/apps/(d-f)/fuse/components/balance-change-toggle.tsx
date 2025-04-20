import { ArrowUpRight } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const _duration = 250;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BalanceChangeToggle: FC = () => {
  const [isPercent, setIsPercent] = useState(false);

  const handlePress = () => {
    setIsPercent(!isPercent);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <AnimatedPressable
      layout={LinearTransition.duration(_duration)}
      className="flex-row items-center gap-0.5 px-1.5 py-1 border border-neutral-300 rounded-xl overflow-hidden"
      onPress={handlePress}
    >
      <ArrowUpRight size={14} color="#22c55e" strokeWidth={2.5} />
      {isPercent ? (
        <Animated.Text
          key="percent"
          entering={FadeInUp.duration(_duration)}
          exiting={FadeOutUp.duration(_duration)}
          className="text-green-500 text-sm font-semibold"
        >
          0.00%
        </Animated.Text>
      ) : (
        <Animated.Text
          key="dollar"
          entering={FadeInDown.duration(_duration)}
          exiting={FadeOutDown.duration(_duration)}
          className="text-green-500 text-sm font-semibold"
        >
          $0.00
        </Animated.Text>
      )}
    </AnimatedPressable>
  );
};
