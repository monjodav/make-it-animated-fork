import { TextInput, View } from "react-native";
import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { BottomBar } from "@/src/shared/components/animations-screen/bottom-bar";
import { SearchBar } from "@/src/shared/components/animations-screen/search-bar";
import { NumberOfAnimations } from "@/src/shared/components/animations-screen/number-of-animations";
import { useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { Animation } from "@/src/shared/lib/types/app";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export default function Animations() {
  const listRef = useRef<FlashListRef<Animation>>(null);
  const textInputRef = useRef<TextInput>(null);

  return (
    <AlgoliaProvider>
      <Animated.View entering={FadeIn} className="flex-1 bg-background">
        <NumberOfAnimations />
        <Results listRef={listRef} />
        <BottomBar textInputRef={textInputRef} />
        <SearchBar textInputRef={textInputRef} listRef={listRef} />
      </Animated.View>
    </AlgoliaProvider>
  );
}
