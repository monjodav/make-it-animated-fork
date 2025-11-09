import React, { FC } from "react";
import { View } from "react-native";

export const ListItem: FC = () => {
  const minWidth = 20;
  const width = Math.random() * 60 + minWidth;

  return (
    <View className="flex-row items-center gap-3 py-1.5">
      <View className="flex-1 flex-row items-center gap-2">
        <View className="h-5 w-5 rounded-full bg-linear-front" />
        <View className="h-3 rounded-full bg-linear-front" style={{ width: `${width}%` }} />
      </View>
      <View className="h-6 w-6 rounded-full bg-linear-front" />
    </View>
  );
};
