import React, { FC } from "react";
import { View } from "react-native";
import { Logo } from "./logo";

// threads-home-header-tabs-animation 🔽

export const HomeHeader: FC = () => {
  return (
    // Header content for collapsible tab system - appears/disappears based on scroll
    <View className="items-center justify-center">
      <Logo width={24} />
    </View>
  );
};

// threads-home-header-tabs-animation 🔼
