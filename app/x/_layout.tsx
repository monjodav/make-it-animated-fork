import { XTabsProvider } from "@/providers/x-tabs-provider";
import { Slot } from "expo-router";

export default function XLayout() {
  return (
    <XTabsProvider>
      <Slot />
    </XTabsProvider>
  );
}
