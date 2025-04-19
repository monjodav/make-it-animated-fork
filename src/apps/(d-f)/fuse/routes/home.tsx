import React, { FC } from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Coins } from "../components/coins";
import { NFTs } from "../components/nfts";
import { Dashboard } from "../components/dashboard";

type Props = {};

export const Home: FC<Props> = ({}) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-200" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center px-7">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-neutral-300" />
          <View className="gap-1.5">
            <View className="w-12 h-4 rounded-full bg-neutral-300" />
            <View className="w-20 h-3 rounded-full bg-neutral-300" />
          </View>
        </View>
        <View className="w-6 h-6 rounded-full border-[2px] border-neutral-300" />
      </View>
      <Dashboard />
    </View>
  );
};
