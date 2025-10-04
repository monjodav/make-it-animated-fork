import { Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useLinearHeader } from "../lib/use-linear-header";

const TITLE = "Inbox";

export const Inbox = () => {
  const scrollY = useSharedValue(0);

  useLinearHeader({ offsetY: scrollY, title: TITLE });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
  });

  return (
    <Animated.FlatList
      data={Array.from({ length: 10 }).map((_, i) => i)}
      keyExtractor={(item, index) => `${item}-${index}`}
      className="bg-linear-back"
      contentContainerClassName="pt-2 px-4 pb-4 gap-6"
      renderItem={({ item }) => (
        <View key={item} className="flex-row items-center gap-2">
          <View className="size-14 rounded-full bg-linear-front" />
          <View className="flex-1 gap-3">
            <View className="h-4 w-4/5 rounded-full bg-linear-front" />
            <View className="h-3 w-3/5 rounded-full bg-linear-front" />
          </View>
        </View>
      )}
      ListHeaderComponent={() => <Text className="text-white text-3xl font-bold">{TITLE}</Text>}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    />
  );
};
