import React, { FC } from "react";

import { Check } from "lucide-react-native";
import { View, Text } from "react-native";

type Props = {
  text: string;
};

export const FeatureItem: FC<Props> = ({ text }) => {
  return (
    <View className="flex-row items-center">
      <View className="w-6 h-6 rounded-full items-center justify-center bg-white/10 mr-3">
        <Check color="#fff" size={16} />
      </View>
      <Text className="text-base text-white" maxFontSizeMultiplier={1.1}>
        {text}
      </Text>
    </View>
  );
};
