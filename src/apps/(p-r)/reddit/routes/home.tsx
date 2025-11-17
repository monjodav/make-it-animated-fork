import { View, Pressable, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Menu, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { createMockData, renderListItem } from "../components/mock-data";
import { WithPullToRefresh } from "@/src/shared/components/with-pull-to-refresh";
import Animated from "react-native-reanimated";
import LoadingIndicator from "../components/loading-indicator";

const REFRESH_VIEW_BASE_HEIGHT = 250;

const Home = () => {
  const insets = useSafeAreaInsets();

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

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

      <WithPullToRefresh
        refreshComponent={<LoadingIndicator refreshViewBaseHeight={REFRESH_VIEW_BASE_HEIGHT} />}
        refreshComponentContainerClassName="bg-neutral-50 justify-start overflow-hidden"
        refreshThreshold={400}
        refreshing={refreshing}
        onRefresh={refresh}
        refreshViewBaseHeight={REFRESH_VIEW_BASE_HEIGHT}
        hapticFeedbackDirection="to-bottom"
        backAnimationDuration={700}
      >
        <Animated.FlatList
          data={createMockData(5)}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderListItem}
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: "grey",
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="bg-white"
          scrollEnabled={!refreshing}
        />
      </WithPullToRefresh>
    </View>
  );
};
export default Home;
