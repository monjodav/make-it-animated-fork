import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { useHeaderBackground } from "../lib/hooks/use-header-background";
import { Pencil } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

type Props = {
  offsetY: SharedValue<number>;
};

export const UpdatesContent: FC<Props> = ({ offsetY }) => {
  // whatsapp-updates-screen-header-animation 🔽
  const { contentOffsetY } = useHeaderBackground({ offsetY });
  // whatsapp-updates-screen-header-animation 🔼

  const router = useRouter();

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
          <View className="h-8 w-8 bg-neutral-900 rounded-full mr-3" />
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/whatsapp/my-status");
            }}
            className="h-8 w-8 bg-neutral-900 rounded-full items-center justify-center"
          >
            <Pencil size={14} color="white" />
          </Pressable>
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
