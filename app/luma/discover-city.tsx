import { View } from "react-native";

import { EventItem } from "@/components/luma/event-item";
import { Header } from "@/components/luma/header";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderImage } from "@/components/luma/header-image";

// luma-blurred-header-image-animation 🔽

export default function DiscoverCity() {
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
    },
  });

  const _renderHeader = () => <Header />;

  const _renderItem = () => {
    return (
      <View className="px-4 py-2 bg-black">
        <EventItem />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <HeaderImage scrollY={scrollY} />
      <Animated.FlatList
        data={Array.from({ length: 8 }, (_, index) => index)}
        ListHeaderComponent={_renderHeader}
        renderItem={_renderItem}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1000 / 60}
      />
    </View>
  );
}

// luma-blurred-header-image-animation 🔼
