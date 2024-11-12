import { XTabsProvider } from "@/providers/x-tabs-provider";
import { Stack } from "expo-router/stack";

export default function XLayout() {
  return (
    <XTabsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </XTabsProvider>
  );
}
