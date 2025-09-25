import { Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useScrollContext } from "../lib/scroll-provider";

export const Inbox = () => {
  const { scrollY, setTitle } = useScrollContext();

  useFocusEffect(
    useCallback(() => {
      setTitle("Inbox");
    }, [setTitle])
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
  });
  return (
    <View className="flex-1 bg-black">
      <Animated.FlatList
        onScroll={scrollHandler}
        data={[]}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={() => null}
        ListEmptyComponent={() => {
          return (
            <View className="flex-1 px-4">
              <Text className="text-white text-3xl font-bold mt-2 ">Inbox</Text>
              <View className="h-[20] bg-gray-200 mt-8 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-20 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-20 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-20 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-20 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[20] bg-gray-200 mt-4 rounded-[20]" />
              <View className="h-[50] w-3/5 bg-gray-200 mt-10 rounded-[20]" />
            </View>
          );
        }}
      />
    </View>
  );
};
