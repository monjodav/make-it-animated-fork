import { View } from "react-native";
import React, { FC } from "react";
import { Story } from "../../../lib/data/users";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type StoryProgressBarProps = {
  story: Story;
  index: number;
  storyIndexProgress: SharedValue<number>;
};

const StoryProgressBar: FC<StoryProgressBarProps> = ({ story, index, storyIndexProgress }) => {
  const rDashStyle = useAnimatedStyle(() => {
    const progress = storyIndexProgress.get();

    if (progress < index) {
      return { width: "0%" };
    }
    if (progress > index + 1) {
      return { width: "100%" };
    }
    const storyProgress = progress - index;
    const progressWidth = interpolate(storyProgress, [0, 1], [0, 100], Extrapolation.CLAMP);

    return {
      width: `${progressWidth}%`,
    };
  });

  return (
    <View key={story.id} className="flex-1 bg-neutral-500 h-[2.5px] rounded-full overflow-hidden">
      <Animated.View style={[rDashStyle, { height: "100%" }]} className="bg-white rounded-full" />
    </View>
  );
};

export default StoryProgressBar;
