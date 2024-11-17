import { HomePost } from "@/components/linkedin/home-post";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const _renderItem = () => <HomePost />;

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <View className="bg-linkedin-back mb-2" style={{ height: insets.top }} />
      <FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
}
