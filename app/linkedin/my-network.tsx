import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserCard = () => {
  return (
    <View className="flex-1 aspect-[0.75] rounded-xl border border-[#283036] py-4">
      <View className="flex-1 items-center">
        <View className="w-1/2 aspect-square rounded-full bg-[#283036] mb-4" />
        <View className="w-3/4 h-3 rounded-md bg-[#283036] mb-1" />
        <View className="w-1/2 h-3 rounded-md bg-[#283036]" />
      </View>
      <View className="self-center w-3/4 h-8 rounded-full border border-[#283036] items-center justify-center">
        <View className="w-1/2 h-3 rounded-md bg-[#283036]" />
      </View>
    </View>
  );
};

export default function MyNetwork() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerClassName="gap-2">
        <View className="bg-[#1C2226]" style={{ height: insets.top + 16 }} />
        <View className="bg-[#1C2226] w-full py-4 gap-4">
          <View className="flex-row items-center px-4 gap-4">
            <View className="w-16 h-16 rounded-md bg-[#283036]" />
            <View className="flex-1 gap-2">
              <View className="w-40 h-3 rounded-md bg-[#283036]" />
              <View className="w-32 h-3 rounded-md bg-[#283036]" />
            </View>
          </View>
          <View className="h-px bg-[#283036]" />
          <View className="flex-row items-center px-4 gap-4">
            <View className="w-16 h-16 rounded-md bg-[#283036]" />
            <View className="flex-1 gap-2">
              <View className="w-40 h-3 rounded-md bg-[#283036]" />
              <View className="w-32 h-3 rounded-md bg-[#283036]" />
            </View>
          </View>
        </View>
        <View className="px-4 py-4 gap-4 bg-[#1C2226]">
          <View className="flex-row gap-4">
            <UserCard />
            <UserCard />
          </View>
          <View className="flex-row gap-4">
            <UserCard />
            <UserCard />
          </View>
        </View>
        <View className="px-4 py-4 gap-4 bg-[#1C2226]">
          <View className="flex-row gap-4">
            <UserCard />
            <UserCard />
          </View>
          <View className="flex-row gap-4">
            <UserCard />
            <UserCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
