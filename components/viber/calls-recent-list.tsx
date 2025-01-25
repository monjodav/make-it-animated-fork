import React, { FC } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { CallsListItem } from "./calls-list-item";
import { useIosHeader } from "../_shared/ios-header/provider";

export const CallsRecentList: FC = () => {
  const { listPaddingTop } = useIosHeader();

  return (
    <Animated.FlatList
      data={[]}
      renderItem={({ item }) => <CallsListItem key={item} />}
      ListEmptyComponent={() => (
        <View className="mt-[100px] items-center justify-center gap-6">
          <View className="w-[120px] h-[150px] bg-neutral-900 rounded-3xl" />
          <View className="w-[100px] h-8 bg-neutral-900 rounded-full" />
        </View>
      )}
      contentContainerClassName="gap-4 px-5 pt-3"
      style={{ paddingTop: listPaddingTop }}
    />
  );
};
