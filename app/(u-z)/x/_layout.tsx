import { XTabsProvider } from "@/src/apps/(u-z)/x/lib/providers/x-tabs-provider";
import { Slot } from "expo-router";

// x-bottom-tabs-background-animation 🔽

export default function XLayout() {
  return (
    <XTabsProvider>
      <Slot />
    </XTabsProvider>
  );
}

// x-bottom-tabs-background-animation 🔼
