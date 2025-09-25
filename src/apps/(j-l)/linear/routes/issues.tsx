import { FlatList, View } from "react-native";

export const Issues = () => {
  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={[]}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={() => null}
        ListEmptyComponent={() => {
          return (
            <View className="flex-1 items-center">
              <View className="h-[100] w-[100] bg-gray-200 mt-20 rounded-full" />
              <View className="h-[20] w-4/5 bg-gray-200 mt-20 rounded-[20]" />
              <View className="h-[20] w-4/5 bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] w-4/5 bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] w-4/5 bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
              <View className="h-[10] w-1/5 bg-gray-200 mt-4 rounded-[20]" />
            </View>
          );
        }}
      />
    </View>
  );
};
