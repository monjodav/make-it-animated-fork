import { ScrollView, View } from "react-native";
import { ImageCarousel } from "../components/ImageCarousel";
import { ImageCarouselProvider } from "../lib/providers/image-carousel-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaginationDots } from "../components/pagination-dots";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerClassName="gap-16 py-6"
      style={{ paddingTop: insets.top + 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* instagram-pagination-dots-animation 🔽 */}
      <ImageCarouselProvider images={Array.from({ length: 8 }).map((_, index) => index)}>
        <ImageCarousel />
        <View className="p-4 items-center">
          <PaginationDots />
        </View>
      </ImageCarouselProvider>
      <ImageCarouselProvider images={Array.from({ length: 11 }).map((_, index) => index)}>
        <ImageCarousel />
        <View className="p-4 items-center">
          <PaginationDots />
        </View>
      </ImageCarouselProvider>
      <ImageCarouselProvider images={Array.from({ length: 4 }).map((_, index) => index)}>
        <ImageCarousel />
        <View className="p-4 items-center">
          <PaginationDots />
        </View>
      </ImageCarouselProvider>
      {/* instagram-pagination-dots-animation 🔼 */}
    </ScrollView>
  );
}
