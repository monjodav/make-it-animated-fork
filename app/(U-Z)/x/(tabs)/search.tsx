import { SearchListItem } from "@/components/x/search-list-item";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { useContext } from "react";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// x-bottom-tabs-background-animation 🔽

export default function Search() {
  const { tabBarHeight, handleXTabsOnScroll } = useContext(XTabsContext);

  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: handleXTabsOnScroll,
  });

  const renderItem = () => <SearchListItem />;

  return (
    <View className="flex-1 bg-x-back">
      <Animated.FlatList
        data={Array.from({ length: 40 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-x-front my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// x-bottom-tabs-background-animation 🔼
