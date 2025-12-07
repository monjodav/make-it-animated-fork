import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Heart, Send } from "lucide-react-native";
import React, { FC } from "react";
import { View, TextInput, Pressable } from "react-native";

export const Footer: FC = () => {
  return (
    <View className="flex-row items-center gap-4 px-5 pt-2">
      <TextInput
        placeholder="Send message..."
        placeholderTextColor="white"
        className="flex-1 h-14 text-white text-lg/6 font-medium border border-neutral-500 rounded-full px-4"
        style={{ borderCurve: "continuous" }}
        editable={false}
      />
      <View className="flex-row items-center gap-2">
        <Pressable className="size-10 items-center justify-center" onPress={simulatePress}>
          <Heart size={24} color="white" />
        </Pressable>
        <Pressable className="size-10 items-center justify-center" onPress={simulatePress}>
          <Send size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
