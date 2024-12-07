import { ListHeader } from "@/components/pinterest/list-header";
import { MasonryList } from "@/components/pinterest/masonry-list";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top + 16 }}>
      <MasonryList listHeader={<ListHeader />} />
    </View>
  );
}
