import React, { FC } from "react";
import { View, Text } from "react-native";

export const Sandbox: FC = () => {
  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Text className="text-brand text-4xl font-sans-semibold">Sandbox</Text>
    </View>
  );
};
