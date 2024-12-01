import { NotificationItem } from "@/components/x/notification-item";
import { XTabsContext } from "@/providers/x-tabs-provider";
import { useContext } from "react";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// x-bottom-tabs-background-animation 🔽

export default function Notifications() {
  const { tabBarHeight, handleMomentumBegin, handleScroll } = useContext(XTabsContext);

  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onMomentumBegin: handleMomentumBegin,
    onScroll: handleScroll,
  });

  const renderItem = () => <NotificationItem />;

  return (
    <View className="flex-1 bg-x-back">
      <Animated.FlatList
        data={Array.from({ length: 40 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-x-front my-4" />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: tabBarHeight + 16 }}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// x-bottom-tabs-background-animation 🔼
