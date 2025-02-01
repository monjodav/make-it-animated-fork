import React, { FC } from "react";
import { View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { useHeaderBackground } from "@/hooks/whatsapp/use-header-background";

type Props = {
  offsetY: SharedValue<number>;
};

export const UpdatesContent: FC<Props> = ({ offsetY }) => {
  const { contentOffsetY } = useHeaderBackground({ offsetY });

  return (
    <View
      className="opacity-75"
      onLayout={({ nativeEvent }) => contentOffsetY.set(nativeEvent.layout.y)}
    >
      <View className="h-7 w-[80px] bg-neutral-900 rounded-full mb-6" />
      <View className="flex-row items-center mb-8">
        <View className="h-14 w-14 rounded-full bg-neutral-900 mr-3" />
        <View>
          <View className="h-5 w-24 bg-neutral-900 rounded-full mb-1" />
          <View className="h-4 w-32 bg-neutral-900 rounded-full opacity-60" />
        </View>
        <View className="ml-auto flex-row">
          <View className="h-7 w-7 bg-neutral-900 rounded-full mr-3" />
          <View className="h-7 w-7 bg-neutral-900 rounded-full" />
        </View>
      </View>
      <View className="mb-4">
        <View className="h-7 w-[100px] bg-neutral-900 rounded-full mb-2" />
        <View className="h-4 w-[280px] bg-neutral-900 rounded-full opacity-60 mb-6" />
      </View>

      <View className="h-5 w-[180px] bg-neutral-900 rounded-full mb-4" />

      {Array.from({ length: 10 }).map((item, index) => (
        <View key={index} className="flex-row items-center mb-6">
          <View className="h-12 w-12 rounded-full bg-neutral-900 mr-3" />
          <View>
            <View className="h-5 w-48 bg-neutral-900 rounded-full mb-1" />
            <View className="h-4 w-24 bg-neutral-900 rounded-full opacity-60" />
          </View>
          <View className="ml-auto">
            <View className="h-8 w-20 bg-green-500/5 rounded-full" />
          </View>
        </View>
      ))}
    </View>
  );
};
