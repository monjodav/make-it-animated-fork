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

// Animated progress bar that fills from 0% to 100% as story video plays
// Each bar represents one story in the user's story sequence
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
    // Completed stories: show full width (100%)
    if (index !== currentStoryIndex) {
      if (index < currentStoryIndex) {
        return { width: "100%" };
      }
      // Upcoming stories: show empty (0%)
      return { width: "0%" };
    }

    // Current story: interpolate video progress (0-1) to width percentage (0-100%)
    // Clamped to prevent overflow during rapid seek operations
    const progress = storyProgress.get();
    const widthValue = interpolate(progress, [0, 1], [0, 100], Extrapolation.CLAMP);

    return {
      width: `${widthValue}%`,
    };
  });

  return (
    <View key={story.id} className="flex-1 bg-neutral-500 h-[2.5px] rounded-full overflow-hidden">
      {/* Animated.View enables worklet-based width updates on UI thread for smooth 60fps progress */}
      <Animated.View style={[rDashStyle, { height: "100%" }]} className="bg-white rounded-full" />
    </View>
  );
};

export default StoryProgressBar;

// instagram-stories-carousel-animation 🔼
