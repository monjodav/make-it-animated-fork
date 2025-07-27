import { View } from "react-native";
import { runOnJS, SharedValue, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import type { FC } from "react";

import { AnimatedChar } from "./animated-char";
import React from "react";

// alma-onboarding-carousel-animation 🔽

type Props = {
  text: string;
  activeIndex: SharedValue<number>;
  showIndex: number[];
};

export const StaggeredText: FC<Props> = ({ text, activeIndex, showIndex }: Props) => {
  const progress = useSharedValue(0);

  const show = () => {
    if (progress.value === 1) return;
    setTimeout(() => {
      progress.value = 1;
    }, 250);
  };

  useAnimatedReaction(
    () => activeIndex.get(),
    (value) => {
      if (showIndex.includes(value)) {
        runOnJS(show)();
      } else {
        progress.value = 0;
      }
    }
  );

  return (
    <View className="flex-row flex-wrap">
      {text.split("").map((char, index) => (
        <React.Fragment key={index}>
          <AnimatedChar char={char} index={index} totalCount={text.length} progress={progress} />
        </React.Fragment>
      ))}
    </View>
  );
};

// alma-onboarding-carousel-animation 🔼
