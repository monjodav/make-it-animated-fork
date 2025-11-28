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
import { SearchBar as StaticSearchBar } from "@/src/shared/components/home-screen/without-algolia/search-bar";
import { Animation } from "@/src/shared/lib/types/app";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Results as StaticResults } from "@/src/shared/components/home-screen/without-algolia/results";
import { StaticAnimation } from "@/src/shared/lib/constants/apps";
import { IS_ALGOLIA_ENABLED } from "@/src/shared/lib/constants/base";
import { StaticBottomBar } from "@/src/shared/components/home-screen/without-algolia/static-bottom-bar";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const algoliaListRef = useRef<FlashListRef<Animation>>(null);
  const staticListRef = useRef<FlashListRef<StaticAnimation>>(null);
  const textInputRef = useRef<TextInput>(null);

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 6,
      }}
    >
      {IS_ALGOLIA_ENABLED ? (
        <AlgoliaProvider>
          <NumberOfAnimations listRef={algoliaListRef} />
          <AlgoliaResults listRef={algoliaListRef} />
          <BottomBar textInputRef={textInputRef} />
          <AlgoliaSearchBar textInputRef={textInputRef} listRef={algoliaListRef} />
        </AlgoliaProvider>
      ) : (
        <>
          <StaticResults listRef={staticListRef} />
          <StaticBottomBar textInputRef={textInputRef} />
          <StaticSearchBar textInputRef={textInputRef} listRef={staticListRef} />
        </>
      )}
    </View>
  );
}
