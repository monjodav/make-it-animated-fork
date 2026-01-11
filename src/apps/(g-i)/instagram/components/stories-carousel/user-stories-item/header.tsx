import React, { FC } from "react";
import { View } from "react-native";
import { User } from "../../../lib/data/users";
import { SharedValue } from "react-native-reanimated";
import StoryProgressBar from "./story-progress-bar";

// instagram-stories-carousel-animation 🔽

type Props = {
  user: User;
  currentStoryIndex: number;
  storyProgress: SharedValue<number>;
};

export const Header: FC<Props> = ({ user, currentStoryIndex, storyProgress }) => {
  return (
    <View className="absolute top-2 left-0 right-0 px-4 pt-2 gap-3">
      <View className="flex-row items-center justify-center gap-1">
        {user.stories.map((story, index) => (
          <StoryProgressBar
            key={story.id}
            story={story}
            index={index}
            currentStoryIndex={currentStoryIndex}
            storyProgress={storyProgress}
          />
        ))}
      </View>
      <View className="flex-row items-center justify-center gap-2 self-start">
        <View className="size-12 rounded-full bg-white/20" />
        <View className="gap-2">
          <View className="size-3 w-40 rounded-full bg-white/20" />
          <View className="size-3 w-32 rounded-full bg-white/20" />
        </View>
      </View>
    </View>
  );
};

// instagram-stories-carousel-animation 🔼
