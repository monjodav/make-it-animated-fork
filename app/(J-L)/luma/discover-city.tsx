import { Alert, Platform, View } from "react-native";

import { EventItem } from "@/components/J-L/luma/event-item";
import { Header } from "@/components/J-L/luma/header";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderImage } from "@/components/J-L/luma/header-image";
import { useEffect } from "react";

// luma-blurred-header-image-animation 🔽

export default function DiscoverCity() {
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      scrollY.value = y;
    },
  });

  useEffect(() => {
    if (Platform.OS === "android") {
      Alert.alert("Note", "Bounce effect is not supported on Android. Please try it on iOS.");
    }
  }, []);

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
