import { SearchListItem } from "@/components/x/search-list-item";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View className="flex-1 bg-x-back">
      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={SearchListItem}
        ItemSeparatorComponent={() => <View className="h-px bg-x-front my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
      />
    </View>
  );
}
