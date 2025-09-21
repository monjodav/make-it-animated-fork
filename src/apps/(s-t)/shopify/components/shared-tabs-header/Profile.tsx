import React, { FC } from "react";
import { Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const Profile: FC = () => {
  return (
    <Animated.View entering={FadeIn.duration(150)}>
      <Text className="text-2xl font-bold text-white">Profile</Text>
    </Animated.View>
  );
};
