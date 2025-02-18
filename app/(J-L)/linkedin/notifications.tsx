import { NotificationItem } from "@/components/J-L/linkedin/notification-item";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const _renderItem = () => <NotificationItem />;
const _ItemSeparatorComponent = () => <View className="h-px bg-linkedin-front my-3" />;

export default function Notifications() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-linkedin-back">
      <FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
        ItemSeparatorComponent={_ItemSeparatorComponent}
        contentContainerStyle={{ paddingTop: insets.top + 16 }}
      />
    </View>
  );
}
