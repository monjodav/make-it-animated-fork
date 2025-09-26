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
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} className="flex-1 flex-row items-center gap-2 mt-7 mb-2">
                  <View className="h-16 w-16 rounded-full bg-linear-front" />
                  <View className="flex-1 gap-3">
                    <View className="h-6 w-4/5 rounded-full bg-linear-front" />
                    <View className="h-4 w-3/5 rounded-full bg-linear-front" />
                  </View>
                </View>
              ))}
            </View>
          );
        }}
      />
    </View>
  );
};
