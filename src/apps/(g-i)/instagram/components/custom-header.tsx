import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { Logo } from "./logo";
import { Heart, Send } from "lucide-react-native";
import { useHomeHeaderHeight } from "../lib/hooks/use-home-header-height";

export const HEADER_HEIGHT = 50;

type Props = {};

export const CustomHeader: FC<Props> = ({}) => {
  const { netHeaderHeight, topSafeAreaHeight } = useHomeHeaderHeight();

  return (
    <View
      className="absolute top-0 left-0 right-0 border border-blue-400/0 flex-row items-center justify-between px-5 bg-black z-50"
      style={{ height: netHeaderHeight, top: topSafeAreaHeight }}
    >
      <Logo width={110} height={30} />
      <View className="flex-row items-center gap-8">
        <Pressable>
          <Heart size={22} color="white" />
        </Pressable>
        <Pressable>
          <Send size={22} color="white" />
        </Pressable>
      </View>
    </View>
  );
};
