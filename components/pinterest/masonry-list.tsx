import { MasonryFlashList } from "@shopify/flash-list";
import React, { FC } from "react";
import { View } from "react-native";

const _data = Array.from({ length: 20 }).map((_, index) => ({ id: index }));

export const MasonryList: FC = () => {
  const _renderItem = ({ index }: { index: number }) => {
    const height = Math.floor(Math.random() * 200) + 100;

    return (
      <View
        style={
          index % 2 === 0
            ? {
                paddingRight: 6,
              }
            : {
                paddingLeft: 6,
              }
        }
        className="px-3"
      >
        <View className="w-full rounded-3xl bg-neutral-900" style={{ height }} />
      </View>
    );
  };

  return (
    <MasonryFlashList
      data={_data}
      numColumns={2}
      ItemSeparatorComponent={() => <View className="h-3" />}
      renderItem={_renderItem}
      estimatedItemSize={200}
    />
  );
};
