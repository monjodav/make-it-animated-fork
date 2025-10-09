import { Check } from "lucide-react-native";
import React, { FC } from "react";
import Animated, { Easing, FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Text } from "react-native";

// grok-paywall-screen-animation 🔽

type Props = {
  icon: React.ReactNode;
  text: string;
};

export const FeatureItem: FC<Props> = ({ icon, text }) => {
  return (
    <Animated.View
      className="flex-row items-center justify-between gap-3"
      layout={LinearTransition}
    >
      <Animated.View
        key={text}
        entering={FadeIn.duration(200).easing(Easing.out(Easing.ease))}
        exiting={FadeOut.duration(200).easing(Easing.in(Easing.ease))}
        className="flex-1 flex-row items-center gap-3"
      >
        {icon}
        <Text className="flex-1 text-neutral-50 text-lg font-bold">{text}</Text>
      </Animated.View>
      <Check size={18} color="#fafafa" strokeWidth={3} />
    </Animated.View>
  );
};

// grok-paywall-screen-animation 🔼
