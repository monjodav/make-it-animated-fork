import { View, Text } from "react-native";
import React, { ReactNode } from "react";

type FeatureItemProps = {
  icon: ReactNode;
  title: string;
  description?: string;
};

export const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <View className="flex-row flex-1 gap-3">
      {icon}
      <View className="flex-1 gap-1">
        <Text className="text-neutral-50 text-base font-semibold">{title}</Text>
        {description && <Text className="text-base text-neutral-400">{description}</Text>}
      </View>
    </View>
  );
};
