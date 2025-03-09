import { HomeHeader } from "@/components/J-L/linkedin/home-header";
import { HomePost } from "@/components/J-L/linkedin/home-post";
import { useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// linkedin-header-on-scroll-animation 🔽

const _renderItem = () => <HomePost />;
const _renderItemSeparator = () => <View className="h-2 bg-black" />;

export default function Home() {
  const insets = useSafeAreaInsets();

  const {
    scrollDirection,
    offsetYAnchorOnBeginDrag,
    onBeginDrag,
    onScroll: scrollDirectionOnScroll,
  } = useScrollDirection();

  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag,
    onScroll: (e) => {
      offsetY.value = e.contentOffset.y;
      scrollDirectionOnScroll(e);
    },
  });

  return (
    <View className="flex-1 bg-linkedin-back" style={{ paddingTop: insets.top }}>
      <HomeHeader
        scrollDirection={scrollDirection}
        offsetY={offsetY}
        offsetYAnchorOnBeginDrag={offsetYAnchorOnBeginDrag}
      />
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
