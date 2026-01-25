import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { Platform, TextInput, View } from "react-native";
import { useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { SearchBar as StaticSearchBar } from "@/src/shared/components/home-screen/without-algolia/search-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Results as StaticResults } from "@/src/shared/components/home-screen/without-algolia/results";
import { StaticAnimation } from "@/src/shared/lib/constants/animations";
import { WIP_SCREEN_HREF, SANDBOX } from "@/src/shared/lib/constants/dev";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function Index() {
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const staticListRef = useRef<FlashListRef<StaticAnimation>>(null);
  const textInputRef = useRef<TextInput>(null);

  if (__DEV__) {
    if (SANDBOX) {
      return <Redirect href="/sandbox" />;
    }
    if (WIP_SCREEN_HREF) {
      return <Redirect href={WIP_SCREEN_HREF as Href} />;
    }
  }
  
  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 6,
      }}
    >
      <StaticResults listRef={staticListRef} />
      <StaticSearchBar textInputRef={textInputRef} listRef={staticListRef} />
    </View>
  );
}
