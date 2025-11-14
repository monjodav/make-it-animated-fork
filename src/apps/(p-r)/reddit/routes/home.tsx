import { View, Pressable, Text, StyleSheet, Animated } from "react-native";
import { Home as HomeIcon, Plus, Bell, User, Menu, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { createMockData, renderListItem } from "../components/mock-data";

const Home = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-grey">
      <View
        className="px-4 bg-white"
        style={{
          paddingTop: insets.top,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "grey",
        }}
      >
        <View className="mx-3 py-3 flex-row gap-6 items-center justify-between bg-white">
          <Pressable className="items-center justify-center" onPress={simulatePress}>
            <Menu size={24} color="grey" />
          </Pressable>

          <View className="flex-1 rounded-full border border-orange-400 flex-row items-center p-3">
            <Search size={18} color="grey" />
            <Text className="font-medium text-neutral-700 ml-2">Search</Text>
          </View>

          <Pressable onPress={simulatePress}>
            <Text className="font-medium text-neutral-700">Sign in</Text>
          </Pressable>
        </View>

        <View className="flex-row bg-white justify-between my-4">
          <View className="w-24 h-4 bg-neutral-400 rounded-full" />
          <View className="w-24 h-4 bg-neutral-400 rounded-full" />
          <View className="w-24 h-4 bg-neutral-400 rounded-full" />
        </View>
      </View>

      <Animated.FlatList
        data={createMockData(10)}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderListItem}
        ItemSeparatorComponent={() => (
          <View
            style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "grey" }}
          />
        )}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="bg-white"
      />

      <View
        className="px-4 flex-row bg-white items-center justify-between mt-auto"
        style={{ paddingBottom: insets.bottom }}
      >
        <Pressable className="items-center pt-3">
          <HomeIcon size={24} color="grey" strokeWidth={2} />
          <View className="w-14 h-2 bg-neutral-400 rounded-full mt-1.5" />
        </Pressable>

        <Pressable className="items-center pt-3">
          <View className="w-7 h-7 rounded bg-neutral-400" />
          <View className="w-14 h-2 bg-neutral-400 rounded-full mt-1.5" />
          <View className="absolute top-2 right-1/3 w-2 h-2 rounded-full bg-red-400" />
        </Pressable>

        <Pressable className="items-center pt-3">
          <Plus size={24} color="grey" strokeWidth={2.5} />
          <View className="w-14 h-2 bg-neutral-400 rounded-full mt-1.5" />
        </Pressable>

        <Pressable className="items-center pt-3">
          <Bell size={24} color="grey" />
          <View className="w-14 h-2 bg-neutral-400 rounded-full mt-1.5" />
        </Pressable>

        <Pressable className="items-center pt-3">
          <User size={24} color="grey" />
          <View className="w-14 h-2 bg-neutral-400 rounded-full mt-1.5" />
        </Pressable>
      </View>
    </View>
  );
};
export default Home;
