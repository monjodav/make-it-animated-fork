import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationItem = () => {
  return (
    <View className="flex-row items-center px-4 gap-4">
      <View className="w-12 h-12 rounded-full bg-neutral-900" />
      <View className="flex-1 gap-2">
        <View className="w-[70%] h-3 rounded-md bg-neutral-900" />
        <View className="w-[50%] h-3 rounded-md bg-neutral-900" />
        <View className="w-[55%] h-3 rounded-md bg-neutral-900" />
      </View>
    </View>
  );
};

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={NotificationItem}
        ItemSeparatorComponent={() => <View className="h-px bg-neutral-900 my-4" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
      />
    </View>
  );
}
