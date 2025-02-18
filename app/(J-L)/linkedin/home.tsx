import { HomeHeader } from "@/components/linkedin/home-header";
import { HomePost } from "@/components/linkedin/home-post";
import { useDragDirection } from "@/hooks/use-drag-direction";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// linkedin-header-on-scroll-animation 🔽

const _renderItem = () => <HomePost />;
const _renderItemSeparator = () => <View className="h-2 bg-black" />;

export default function Home() {
  const insets = useSafeAreaInsets();

  const { dragDirection, handleDragDirectionOnBeginDrag, handleDragDirectionOnScroll } =
    useDragDirection({ upThreshold: 75 });

  const listOffsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: handleDragDirectionOnBeginDrag,
    onScroll: (e) => {
      listOffsetY.value = e.contentOffset.y;
      handleDragDirectionOnScroll(e);
    },
  });

  return (
    <View className="flex-1 bg-linkedin-back" style={{ paddingTop: insets.top }}>
      <HomeHeader dragDirection={dragDirection} />
      <Animated.FlatList
        data={Array.from({ length: 10 })}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
        ItemSeparatorComponent={_renderItemSeparator}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}

// linkedin-header-on-scroll-animation 🔼
