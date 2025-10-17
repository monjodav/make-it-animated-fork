import { Check } from "lucide-react-native";
import React, { FC } from "react";
import Animated, { Easing, FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Text } from "react-native";

// grok-paywall-screen-animation 🔽

// Animation notes:
// - FadeIn/FadeOut at 200ms: snappy list updates that match quick paywall toggles
// - Easing.out/in(Easing.ease): accelerates entrance, decelerates exit for natural feel
// - LinearTransition for layout: smooth spacing changes when items are added/removed/reordered
//   (runs on UI thread; avoids layout jank when the pricing plan switches)

type Props = {
  icon: React.ReactNode;
  text: string;
};

export const FeatureItem: FC<Props> = ({ icon, text }) => {
  return (
    <Animated.View
      className="flex-row items-center justify-between gap-3"
      // Layout animation: keeps sibling spacing stable while list reflows on content change
      // Useful when the plan switch causes items to mount/unmount
      layout={LinearTransition.duration(200).easing(Easing.out(Easing.ease))}
    >
      <Animated.View
        key={text}
        // Enter: quick 200ms fade to make list additions feel immediate
        entering={FadeIn.duration(200).easing(Easing.out(Easing.ease))}
        // Exit: symmetric 200ms fade; ease-in makes the disappearance feel lighter
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
