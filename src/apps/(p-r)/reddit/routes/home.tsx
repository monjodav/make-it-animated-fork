import { View, Pressable, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Menu } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { WithPullToRefresh } from "@/src/shared/components/with-pull-to-refresh";
import { ListItem } from "../components/list-item";
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

          <View className="flex-1 rounded-full border border-orange-400 flex-row items-center p-2">
            <View className="size-8 rounded-full bg-orange-500" />
            <Text className="absolute inset-x-0 text-center text-lg text-neutral-500">
              Find anything
            </Text>
          </View>

          <Pressable onPress={simulatePress}>
            <Text className="font-semibold text-neutral-700">Log in</Text>
          </Pressable>
        </View>

        <View className="flex-row bg-white my-4 gap-2">
          <View className="w-20 h-8 bg-neutral-200 rounded-lg" />
          <View className="w-20 h-8 bg-neutral-200 rounded-lg" />
          <View className="w-20 h-8 bg-neutral-200 rounded-lg" />
        </View>
      </View>

      <WithPullToRefresh
        refreshComponent={<LoadingIndicator refreshViewBaseHeight={REFRESH_VIEW_BASE_HEIGHT} />}
        refreshComponentContainerClassName="bg-neutral-50 justify-start overflow-hidden"
        refreshing={refreshing}
        onRefresh={refresh}
        refreshThreshold={REFRESH_VIEW_BASE_HEIGHT}
        refreshViewBaseHeight={REFRESH_VIEW_BASE_HEIGHT}
        hapticFeedbackDirection="to-bottom"
        backAnimationDuration={500}
      >
        <Animated.FlatList
          data={Array.from({ length: 10 })}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={() => <ListItem />}
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
