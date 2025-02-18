import { UserCard } from "@/components/linkedin/user-card";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyNetwork() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerClassName="gap-2">
        <View className="bg-linkedin-back" style={{ height: insets.top + 16 }} />
        <View className="bg-linkedin-back w-full py-4 gap-4">
          <View className="flex-row items-center px-4 gap-4">
            <View className="w-16 h-16 rounded-md bg-linkedin-front" />
            <View className="flex-1 gap-2">
              <View className="w-40 h-3 rounded-md bg-linkedin-front" />
              <View className="w-32 h-3 rounded-md bg-linkedin-front" />
            </View>
          </View>
          <View className="h-px bg-linkedin-front" />
          <View className="flex-row items-center px-4 gap-4">
            <View className="w-16 h-16 rounded-md bg-linkedin-front" />
            <View className="flex-1 gap-2">
              <View className="w-40 h-3 rounded-md bg-linkedin-front" />
              <View className="w-32 h-3 rounded-md bg-linkedin-front" />
            </View>
          </View>
        </View>
        <View className="px-4 py-4 gap-4 bg-linkedin-back">
          <View className="flex-row gap-4">
            <UserCard />
            <UserCard />
          </View>
          <View className="flex-row gap-4">
            <UserCard />
            <UserCard />
          </View>
        </View>
        <View className="px-4 py-4 gap-4 bg-linkedin-back">
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
