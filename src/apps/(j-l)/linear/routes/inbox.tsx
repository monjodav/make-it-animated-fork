import { Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useLinearHeader } from "../lib/use-linear-header";

// linear-header-on-scroll-animation 🔽

const TITLE = "Inbox";

export const Inbox = () => {
  const { height } = useWindowDimensions();

  // Shared scroll offset drives header flip progress via useLinearHeader.
  const scrollY = useSharedValue(0);

  // Wire the animated header; thresholding/timing handled in the hook.
  useLinearHeader({ offsetY: scrollY, title: TITLE });

  // UI-thread scroll handler keeps scroll → animation path jank-free.
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
  });

  return (
    <Animated.FlatList
      data={Array.from({ length: 5 }).map((_, i) => i)}
      keyExtractor={(item, index) => `${item}-${index}`}
      className="bg-linear-back"
      contentContainerClassName="pt-2 px-4 pb-4 gap-6"
      contentContainerStyle={{ paddingBottom: height }}
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
      // ~60fps updates ensure smooth flip timing without overloading JS.
      scrollEventThrottle={16}
    />
  );
};

// linear-header-on-scroll-animation 🔼
