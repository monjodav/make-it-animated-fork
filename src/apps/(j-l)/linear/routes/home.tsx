import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useLinearHeader } from "../lib/use-linear-header";

const TITLE = "Home";

export default function Home() {
  const router = useRouter();

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
              <View className="h-4 w-2/5 mt-8 rounded-full bg-linear-front" />
              <View className="h-4 w-3/5 mt-8 rounded-full bg-linear-front" />
              <View className="h-4 w-2/6 mt-8 rounded-full bg-linear-front" />

              {Array.from({ length: 10 }).map((_, i) => (
                <Pressable
                  key={i}
                  className="flex-1 flex-row items-center gap-3 mt-7 mb-2"
                  onPress={() => router.push("/linear/home/dev-issues")}
                >
                  <View className="h-10 w-10 rounded-full bg-linear-front" />
                  <View className="h-5 w-3/5 rounded-full bg-linear-front" />
                </Pressable>
              ))}
            </View>
          );
        }}
      />
    </View>
  );
}
