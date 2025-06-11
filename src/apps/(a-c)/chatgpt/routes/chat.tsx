import React, { FC, useEffect } from "react";
import { View } from "react-native";
import { ShimmerText } from "../components/shimmer-text";
import { useNavigation } from "expo-router";

export const Chat: FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  return (
    <View className="flex-1 pt-20 bg-black">
      <ShimmerText style={{ fontSize: 24, color: "#a1a1aa" }}>Processing Image</ShimmerText>
    </View>
  );
};
