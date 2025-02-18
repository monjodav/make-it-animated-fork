import { XTabsProvider } from "@/providers/x-tabs-provider";
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
