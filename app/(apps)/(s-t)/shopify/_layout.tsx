import { Stack } from "expo-router";
import { SharedTabsHeader } from "@/src/apps/(s-t)/shopify/components/shared-tabs-header";

export default function ShopifyLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <SharedTabsHeader />,
        contentStyle: {
          backgroundColor: "black",
        },
      }}
    />
  );
}
