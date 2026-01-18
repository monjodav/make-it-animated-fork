import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { Platform, TextInput, View } from "react-native";
import { useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { NumberOfAnimations } from "@/src/shared/components/home-screen/number-of-animations";
import { Results as AlgoliaResults } from "@/src/shared/components/home-screen/results";
import { BottomBar } from "@/src/shared/components/home-screen/bottom-bar";
import { SearchBar as AlgoliaSearchBar } from "@/src/shared/components/home-screen/search-bar";
import { Animation } from "@/src/shared/lib/types/app";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, Redirect } from "expo-router";
import { DEV_HREF, SANDBOX } from "@/src/shared/lib/constants/dev";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const algoliaListRef = useRef<FlashListRef<Animation>>(null);
  const textInputRef = useRef<TextInput>(null);

  if (__DEV__) {
    if (SANDBOX) {
      return <Redirect href="/sandbox" />;
    }
    if (DEV_HREF) {
      return <Redirect href={DEV_HREF as Href} />;
    }
  }

  return (
    <AlgoliaProvider>
      <View
        className="flex-1 bg-background"
        style={{
          paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 6,
        }}
      >
        <NumberOfAnimations listRef={algoliaListRef} />
        <AlgoliaResults listRef={algoliaListRef} />
        <BottomBar textInputRef={textInputRef} />
        <AlgoliaSearchBar textInputRef={textInputRef} listRef={algoliaListRef} />
      </View>
    </AlgoliaProvider>
  );
}
