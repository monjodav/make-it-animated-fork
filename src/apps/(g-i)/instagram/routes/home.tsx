import { View, Text, useWindowDimensions, ScrollView } from "react-native";
import {
  Carousel,
  CarouselContent,
  CarouselImage,
  CarouselPagination,
} from "../components/carousel";
import { CustomHeader } from "../components/custom-header";
import Animated from "react-native-reanimated";
import { useHomeHeaderHeight } from "../lib/hooks/use-home-header-height";

type Post = {
  images: CarouselImage[];
};

const posts: Post[] = [
  { images: Array.from({ length: 8 }).map((_, index) => index) },
  { images: Array.from({ length: 11 }).map((_, index) => index) },
  { images: Array.from({ length: 4 }).map((_, index) => index) },
  { images: Array.from({ length: 12 }).map((_, index) => index) },
  { images: Array.from({ length: 2 }).map((_, index) => index) },
  { images: Array.from({ length: 10 }).map((_, index) => index) },
  { images: Array.from({ length: 6 }).map((_, index) => index) },
  { images: Array.from({ length: 16 }).map((_, index) => index) },
];

export default function Home() {
  const { width } = useWindowDimensions();

  const { netHeaderHeight, topSafeAreaHeight } = useHomeHeaderHeight();

  const _renderListHeader = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-5"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <View key={index} className="items-center gap-3">
            <View className="w-20 h-20 rounded-full bg-neutral-900" />
            <View className="w-20 h-2 rounded-full bg-neutral-900" />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <View style={{ height: topSafeAreaHeight }} />
      <CustomHeader />
      <Animated.FlatList
        data={posts}
        renderItem={({ item, index }) => (
          // instagram-pagination-dots-animation 🔽
          <Carousel key={index} images={item.images}>
            <CarouselContent
              width={width}
              renderItem={({ item }) => (
                <View
                  className="bg-neutral-900 items-center justify-center aspect-square"
                  style={{ width }}
                >
                  <Text className="text-neutral-600 text-5xl">{item}</Text>
                </View>
              )}
            />
            <View className="p-3 items-center">
              <CarouselPagination />
            </View>
          </Carousel>
          // instagram-pagination-dots-animation 🔼
        )}
        ListHeaderComponent={_renderListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-10"
        contentContainerStyle={{ paddingTop: netHeaderHeight + 16 }}
      />
    </View>
  );
}
