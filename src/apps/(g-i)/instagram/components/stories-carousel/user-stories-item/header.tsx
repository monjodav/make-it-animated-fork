import React, { FC } from "react";
import { View } from "react-native";
import { User } from "../../../lib/data/users";
import { SharedValue } from "react-native-reanimated";
import StoryProgressBar from "./story-progress-bar";

type Props = {
  user: User;
  storyIndexProgress: SharedValue<number>;
};

export const Header: FC<Props> = ({ user, storyIndexProgress }) => {
  return (
    <View className="absolute top-0 left-0 right-0 px-4 pt-2 flex-row gap-1">
      {user.stories.map((story, storyIdx) => (
        <StoryProgressBar
          key={story.id}
          story={story}
          index={storyIdx}
          storyIndexProgress={storyIndexProgress}
        />
      ))}
    </View>
  );
};
