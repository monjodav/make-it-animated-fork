import { View } from "react-native";
import React, { FC } from "react";
import { Story } from "../../../lib/data/users";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// instagram-stories-carousel-animation 🔽

type StoryProgressBarProps = {
  story: Story;
  index: number;
  currentStoryIndex: number;
  storyProgress: SharedValue<number>;
};

const StoryProgressBar: FC<StoryProgressBarProps> = ({
  story,
  index,
  currentStoryIndex,
  storyProgress,
}) => {
  const rDashStyle = useAnimatedStyle(() => {
    if (index !== currentStoryIndex) {
      if (index < currentStoryIndex) {
        return { width: "100%" };
      }
      return { width: "0%" };
    }

    const progress = storyProgress.get();
    const widthValue = interpolate(progress, [0, 1], [0, 100], Extrapolation.CLAMP);

    return {
      width: `${widthValue}%`,
    };
  });

  return (
    <View key={story.id} className="flex-1 bg-neutral-500 h-[2.5px] rounded-full overflow-hidden">
      <Animated.View style={[rDashStyle, { height: "100%" }]} className="bg-white rounded-full" />
    </View>
  );
};

export default StoryProgressBar;

// instagram-stories-carousel-animation 🔼
