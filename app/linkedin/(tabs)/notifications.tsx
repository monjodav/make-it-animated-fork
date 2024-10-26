import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationItem = () => {
  return (
    <View className="flex-row items-center px-4 gap-4">
      <View className="w-16 h-16 rounded-full bg-[#283036]" />
      <View className="flex-1 gap-2">
        <View className="w-[70%] h-3 rounded-md bg-[#283036]" />
        <View className="w-[50%] h-3 rounded-md bg-[#283036]" />
      </View>
    </View>
  );
};

export default function Notifications() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#1C2226]">
      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={NotificationItem}
        ItemSeparatorComponent={() => <View className="h-px bg-[#283036] my-3" />}
        contentContainerStyle={{ paddingTop: insets.top + 16 }}
      />
    </View>
  );
}
