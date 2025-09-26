import { View, Text } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useLinearHeader } from "../lib/use-linear-header";
import { LinearIssues } from "../components/linear-issues";

const TITLE = "My Issues";

export const Issues = () => {
  const scrollY = useSharedValue(0);
  useLinearHeader({ offsetY: scrollY, title: TITLE });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
  });

  return (
    <View className="flex-1 bg-linear-back">
      <Animated.FlatList
        onScroll={scrollHandler}
        data={[]}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={() => null}
        ListEmptyComponent={() => {
          return (
            <View className="flex-1 px-4">
              <Text className="text-white text-3xl font-bold mt-2">{TITLE}</Text>
              <View className="flex-row justify-between pb-3">
                <View className="h-10 w-3/12 mt-8 rounded-full bg-linear-front" />
                <View className="h-10 w-3/12 mt-8 rounded-full bg-linear-front" />
                <View className="h-10 w-3/12 mt-8 rounded-full bg-linear-front" />
              </View>
              <LinearIssues />
            </View>
          );
        }}
      />
    </View>
  );
};
