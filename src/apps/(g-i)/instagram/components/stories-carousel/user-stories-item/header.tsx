import React, { FC } from "react";
import { View } from "react-native";
import { User } from "../../../lib/data/users";
import { SharedValue } from "react-native-reanimated";
import StoryProgressBar from "./story-progress-bar";

type Props = {
  user: User;
  currentStoryIndex: number;
  storyProgress: SharedValue<number>;
};

export const Header: FC<Props> = ({ user, currentStoryIndex, storyProgress }) => {
  return (
    <View className="absolute top-2 left-0 right-0 px-4 pt-2 flex-row gap-1">
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
  );
};
