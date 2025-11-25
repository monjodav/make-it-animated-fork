import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { Platform, TextInput, View } from "react-native";
import { useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { NumberOfAnimations } from "@/src/shared/components/home-screen/number-of-animations";
import { Results } from "@/src/shared/components/home-screen/results";
import { BottomBar } from "@/src/shared/components/home-screen/bottom-bar";
import { SearchBar } from "@/src/shared/components/home-screen/search-bar";
import { Animation } from "@/src/shared/lib/types/app";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const listRef = useRef<FlashListRef<Animation>>(null);
  const textInputRef = useRef<TextInput>(null);
  return <Redirect href="/alma/nutrients" />;

  return (
    <AlgoliaProvider>
      <View
        className="flex-1 bg-background"
        style={{
          paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 6,
        }}
      >
        <NumberOfAnimations listRef={listRef} />
        <Results listRef={listRef} />
        <BottomBar textInputRef={textInputRef} />
        <SearchBar textInputRef={textInputRef} listRef={listRef} />
      </View>
    </AlgoliaProvider>
  );
}
