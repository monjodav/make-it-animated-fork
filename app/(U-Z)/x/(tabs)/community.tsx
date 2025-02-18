import { CommunityPost } from "@/components/U-Z/x/community-post";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { useContext } from "react";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// x-bottom-tabs-background-animation 🔽

export default function Community() {
  const { tabBarHeight, handleXTabsOnScroll } = useContext(XTabsContext);

  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: handleXTabsOnScroll,
  });

  return (
    <View className="flex-1 bg-x-back">
      <Animated.FlatList
        data={Array.from({ length: 20 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => <CommunityPost />}
        ItemSeparatorComponent={() => <View className="h-px bg-x-front my-6" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// x-bottom-tabs-background-animation 🔼
