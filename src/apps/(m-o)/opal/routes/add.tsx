import React, { FC } from "react";
import { View } from "react-native";
import Carousel from "../components/carousel/carousel";

export const Add: FC = () => {
  return (
    <View className="flex-1 bg-black">
      <Carousel />
    </View>
  );
};
