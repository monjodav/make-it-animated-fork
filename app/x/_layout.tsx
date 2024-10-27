import { TabsProvider } from "@/providers/x/TabsProvider";
import { Stack } from "expo-router/stack";

export default function XLayout() {
  return (
    <TabsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TabsProvider>
  );
}
