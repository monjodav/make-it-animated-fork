import React, { FC, useEffect } from "react";
import { View } from "react-native";
import { ShimmerText } from "../components/shimmer-text";
import { useNavigation } from "expo-router";
import { useIOSNote } from "@/src/shared/lib/hooks/use-ios-note";

export const Chat: FC = () => {
  useIOSNote(
    "On iOS 26 there is a known issue with the header layout. The fix is ready and the app is awaiting review to release a new version. Sorry for the inconvenience."
  );

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 p-6">
        <View className="w-56 h-10 rounded-full bg-neutral-900 mb-12 self-end" />
        <View className="p-5 rounded-xl border border-white/15 self-start">
          {/* chatgpt-shimmer-text-animation 🔽 */}
          <ShimmerText style={{ fontSize: 16, color: "#525252" }}>Processing Image</ShimmerText>
          {/* chatgpt-shimmer-text-animation 🔼 */}
          <View className="w-[250px] h-3 rounded-full bg-neutral-900 mt-4 mb-2" />
          <View className="w-[250px] h-3 rounded-full bg-neutral-900 mb-2" />
          <View className="w-[200px] h-3 rounded-full bg-neutral-900 mb-2" />
        </View>
      </View>
      <View className="h-[110px] bg-neutral-900 rounded-t-3xl " />
    </View>
  );
};
