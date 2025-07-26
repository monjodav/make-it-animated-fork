import { View } from "react-native";
import { runOnJS, SharedValue, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import type { FC } from "react";

import { AnimatedChar } from "./animated-char";
import React from "react";

type Props = {
  text: string;
  slideIndex: SharedValue<number>;
  showIndex: number[];
};

export type StaggeredTextRef = {
  animate: () => void;
  reset: () => void;
};

export const StaggeredText: FC<Props> = ({ text, slideIndex, showIndex }: Props) => {
  const progress = useSharedValue(0);

  const show = () => {
    setTimeout(() => {
      progress.value = 1;
    }, 250);
  };

  useAnimatedReaction(
    () => slideIndex.get(),
    (slideIndex) => {
      if (showIndex.includes(slideIndex)) {
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
