import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Post = () => {
  return (
    <View className="bg-[#1C2226] w-full py-4">
      <View className="flex-row items-center px-4 gap-4 mb-4">
        <View className="w-16 h-16 rounded-md bg-[#283036]" />
        <View className="flex-1 gap-2">
          <View className="w-40 h-3 rounded-md bg-[#283036]" />
          <View className="w-32 h-3 rounded-md bg-[#283036]" />
        </View>
      </View>
      <View className="px-4 gap-2 mb-4">
        <View className="w-full h-3 rounded-md bg-[#283036]" />
        <View className="w-5/6 h-3 rounded-md bg-[#283036]" />
      </View>
      <View className="w-full aspect-square bg-[#283036] mb-6" />
      <View className="px-8 flex-row justify-between">
        {Array.from({ length: 4 }).map((_, index) => (
          <View className="gap-2 items-center" key={index}>
            <View className="w-4 h-4 rounded-md bg-[#283036]" />
            <View className="w-8 h-2 rounded-full bg-[#283036]" />
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <Post />}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
}
