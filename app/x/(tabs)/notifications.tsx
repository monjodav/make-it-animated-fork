import { NotificationItem } from "@/components/x/notification-item";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { useContext } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { tabBarHeight } = useContext(XTabsContext);

  const renderItem = () => <NotificationItem />;

  return (
    <View className="flex-1 bg-x-back">
      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-x-front my-4" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
      />
    </View>
  );
}
