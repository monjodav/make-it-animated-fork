import React, { FC } from "react";
import { View } from "react-native";
import { Title } from "./title";
import { Left } from "./left";
import { Right } from "./right";

// slack-catch-up-cards-swipe-animation 🔽

export const UnreadHeader: FC = () => {
  return (
    <View className="flex-row items-center justify-between px-2 mb-3">
      <Title />
      <Left />
      <Right />
    </View>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
