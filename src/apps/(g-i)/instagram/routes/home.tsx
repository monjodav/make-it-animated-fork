import { View } from "react-native";
import { ImageCarousel } from "../components/ImageCarousel";
import { ImageCarouselProvider } from "../lib/providers/image-carousel-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaginationDots } from "../components/pagination-dots";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top + 16 }}>
      <ImageCarouselProvider>
        <ImageCarousel />
        <View className="p-4 items-center">
          <PaginationDots defaultDotColor="#525252" activeDotColor="#3b82f6" />
        </View>
      </ImageCarouselProvider>
    </View>
  );
}
