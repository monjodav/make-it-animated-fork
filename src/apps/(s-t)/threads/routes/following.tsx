import React, { FC } from "react";
import { FlatList, View } from "react-native";
import { HomePost } from "../components/home-post";

export const Following: FC = () => {
  return (
    <FlatList
      data={Array.from({ length: 10 })}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <HomePost />}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pt-5"
      ItemSeparatorComponent={() => <View className="h-[0.5px] bg-neutral-800 my-4" />}
    />
  );
};
