#!/usr/bin/env node
/* eslint-disable prettier/prettier */

/**
 * This script resets app/index.tsx to a clean state with static components for public branch.
 * Can be run independently or as part of prepare-public.js
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const indexTsxContent = `import { useWarmUpBrowser } from "@/src/shared/lib/hooks/use-warm-up-browser";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { Platform, TextInput, View } from "react-native";
import { useRef } from "react";
import { FlashListRef } from "@shopify/flash-list";
import { SearchBar as StaticSearchBar } from "@/src/shared/components/home-screen/without-algolia/search-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Results as StaticResults } from "@/src/shared/components/home-screen/without-algolia/results";
import { StaticAnimation } from "@/src/shared/lib/constants/apps";
import { DEV_HREF, SANDBOX } from "@/src/shared/lib/constants/dev";

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
    if (DEV_HREF) {
      return <Redirect href={DEV_HREF as Href} />;
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
`;

const resetIndex = async () => {
  try {
    const indexTsxPath = path.join(root, "app/index.tsx");

    // Write the clean index.tsx content
    await fs.promises.writeFile(indexTsxPath, indexTsxContent, "utf8");
    console.log("📝 Reset app/index.tsx to clean state.");
  } catch (error) {
    console.error(`❌ Error resetting index.tsx: ${error.message}`);
    throw error;
  }
};

// Allow running as standalone script or being imported
if (require.main === module) {
  resetIndex()
    .then(() => {
      console.log("\n✅ Index reset complete!");
    })
    .catch((error) => {
      console.error(`❌ Error during script execution: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { resetIndex };

