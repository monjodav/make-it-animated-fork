import { ChevronLeft } from "lucide-react-native";
import React, { FC } from "react";
import { View, Text, Pressable, Alert } from "react-native";

type Props = {
  total: number;
};

export const UnreadHeader: FC<Props> = ({ total }) => {
  return (
    <View className="flex-row items-center justify-between px-2 mb-3">
      <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
        <Text className="text-lg font-bold text-white">{total} Left</Text>
      </View>
      <Pressable onPress={() => Alert.alert("Back")}>
        <ChevronLeft size={28} color="#fff" strokeWidth={1.5} />
      </Pressable>
    </View>
  );
};
