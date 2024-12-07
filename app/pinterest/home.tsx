import { ListHeader } from "@/components/pinterest/list-header";
import { MasonryList } from "@/components/pinterest/masonry-list";
import { TabBar } from "@/components/pinterest/tab-bar";
import { useRef } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Board = {
  title: string;
  list: React.ReactNode;
};

export type Tab = {
  title: string;
  value: number;
};

const boards: Board[] = [
  {
    title: "All",
    list: <MasonryList />,
  },
  {
    title: "ColorsApp",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "project 1",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "Cafe Design Ideas",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "furniture",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "Cafe decoration",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "wild room coffee place Odesa, Ukraine",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "Food and drinks",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
  {
    title: "Logo",
    list: <MasonryList listHeader={<ListHeader />} />,
  },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const tabs: Tab[] = boards.map((board, index) => ({ title: board.title, value: index }));

  const listRef = useRef<FlatList>(null);
  const listOffsetX = useSharedValue(0);
  const isListScrollingX = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isListScrollingX.value = true;
    },
    onScroll: (event) => {
      listOffsetX.value = event.contentOffset.x;
    },
    onMomentumEnd: () => {
      isListScrollingX.value = false;
    },
  });

  const _renderItem = ({ item }: { item: Board }) => {
    return <View style={{ width }}>{item.list}</View>;
  };

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top + 16 }}>
      <View className="mb-6">
        <TabBar
          tabs={tabs}
          listRef={listRef}
          listOffsetX={listOffsetX}
          isListScrollingX={isListScrollingX}
        />
      </View>
      <Animated.FlatList
        ref={listRef}
        data={boards}
        renderItem={_renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={1000 / 60}
      />
    </View>
  );
}
