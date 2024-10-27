import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Post = () => {
  return (
    <View className="w-full px-4 flex-row gap-4">
      <View className="w-16 h-16 rounded-full bg-neutral-900" />
      <View className="flex-1">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-1 gap-2">
            <View className="w-40 h-3 rounded-md bg-neutral-900" />
            <View className="w-32 h-3 rounded-md bg-neutral-900" />
          </View>
        </View>
        <View className="gap-2 mb-4">
          <View className="w-full h-3 rounded-md bg-neutral-900" />
          <View className="w-full h-3 rounded-md bg-neutral-900" />
          <View className="w-full h-3 rounded-md bg-neutral-900" />
          <View className="w-full h-3 rounded-md bg-neutral-900" />
          <View className="w-5/6 h-3 rounded-md bg-neutral-900" />
        </View>
      </View>
    </View>
  );
};

export default function Community() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <Post />}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-900 my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
      />
    </View>
  );
}
