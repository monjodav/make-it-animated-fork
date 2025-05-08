import { ScrollView, View, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Carousel,
  CarouselContent,
  CarouselImage,
  CarouselPagination,
} from "../components/carousel";

type Post = {
  images: CarouselImage[];
};

const posts: Post[] = [
  { images: Array.from({ length: 8 }).map((_, index) => index) },
  { images: Array.from({ length: 11 }).map((_, index) => index) },
  { images: Array.from({ length: 4 }).map((_, index) => index) },
];

export default function Home() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerClassName="gap-16 py-6"
      style={{ paddingTop: insets.top + 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* instagram-pagination-dots-animation 🔽 */}
      {posts.map((post, index) => (
        <Carousel key={index} images={post.images}>
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
      ))}
      {/* instagram-pagination-dots-animation 🔼 */}
    </ScrollView>
  );
}
