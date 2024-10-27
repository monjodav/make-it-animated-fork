import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ListItem = () => {
  return (
    <View className="gap-3 px-4">
      <View className="w-[30%] h-4 rounded-md bg-neutral-900" />
      <View className="w-[40%] h-3 rounded-md bg-neutral-900" />
      <View className="w-[45%] h-3 rounded-md bg-neutral-900" />
    </View>
  );
};

export default function Search() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={ListItem}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-900 my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
      />
    </View>
  );
}
