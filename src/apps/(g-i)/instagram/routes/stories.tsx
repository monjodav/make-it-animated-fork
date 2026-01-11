import { View } from "react-native";
import StoriesCarousel from "../components/stories-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// instagram-stories-carousel-animation 🔽

export default function Search() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top + 6, paddingBottom: insets.bottom + 6 }}
      className="flex-1 bg-black"
    >
      <StoriesCarousel />
    </View>
  );
}

// instagram-stories-carousel-animation 🔼
